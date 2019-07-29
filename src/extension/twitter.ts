import axios, {AxiosError} from 'axios';
import crypto from 'crypto';
import delay from 'delay';
import {IncomingMessage} from 'http';
import loadJsonFile from 'load-json-file';
import OAuth from 'oauth-1.0a';
import path from 'path';
import {URLSearchParams} from 'url';
import writeJsonFile from 'write-json-file';
import {NodeCG} from './nodecg';
import {URL} from 'url';

/**
 * Twitter access token stored in JSON file
 */
interface Token {
	token: string;
	secret: string;
}
const isToken = (data: any): data is Token => {
	return (
		data &&
		typeof data.token === 'string' &&
		typeof data.secret === 'string'
	);
};

const accessTokenPath = path.resolve(__dirname, 'db/twitter-access-token.json');
const loadAccessToken = async () => {
	const accessToken = await loadJsonFile(accessTokenPath);
	if (!isToken(accessToken)) {
		throw new Error('Invalid Twitter access token loaded from DB');
	}
	return accessToken;
};
const saveAccessToken = async ({token, secret}: Token) => {
	await writeJsonFile(accessTokenPath, {token, secret});
};

/**
 * Twitter request token stored in memory
 */
let requestToken = {
	token: '',
	secret: '',
};

/**
 * Twitter stream API interface
 */
let twitterStream: IncomingMessage | null = null;

export const twitter = async (nodecg: NodeCG) => {
	const twitterConfig = nodecg.bundleConfig.twitter;
	if (!twitterConfig) {
		nodecg.log.warn('Twitter config is empty');
		return;
	}

	const callbackUrl = `http://${nodecg.config.baseURL}/bundles/${nodecg.bundleName}/twitter-callback/index.html`;

	const twitterRep = nodecg.Replicant('twitter');
	const tweetsRep = nodecg.Replicant('tweets', {defaultValue: []});

	const oauth = new OAuth({
		consumer: {
			key: twitterConfig.consumerKey,
			secret: twitterConfig.consumerSecret,
		},
		signature_method: 'HMAC-SHA1',
		hash_function: (baseString, key) => {
			return crypto
				.createHmac('sha1', key)
				.update(baseString)
				.digest('base64');
		},
		realm: '',
	});

	const deleteTweetById = (id: string) => {
		if (!tweetsRep.value) {
			return;
		}
		const selectedTweetIndex = tweetsRep.value.findIndex(
			(t) => t.id === id,
		);
		if (selectedTweetIndex === -1) {
			return undefined;
		}
		const tweet = tweetsRep.value[selectedTweetIndex];
		tweetsRep.value.splice(selectedTweetIndex, 1);
		return tweet;
	};

	const getRequestToken = async () => {
		const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
		const oauthData = oauth.authorize({
			url: REQUEST_TOKEN_URL,
			method: 'POST',
			data: {
				oauth_callback: callbackUrl,
			},
		});
		const res = await axios.post(REQUEST_TOKEN_URL, undefined, {
			headers: oauth.toHeader(oauthData),
		});
		const requestTokenParams = new URLSearchParams(res.data);
		return {
			token: requestTokenParams.get('oauth_token') || '',
			secret: requestTokenParams.get('oauth_token_secret') || '',
		};
	};

	const getAccessToken = async (oauthVerifier: string) => {
		const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
		const data = {oauth_verifier: oauthVerifier};
		const oauthData = oauth.authorize(
			{
				url: ACCESS_TOKEN_URL,
				method: 'POST',
				data,
			},
			{key: requestToken.token, secret: requestToken.token},
		);
		const res = await axios.post(ACCESS_TOKEN_URL, data, {
			headers: oauth.toHeader(oauthData),
		});
		const accessTokenParams = new URLSearchParams(res.data);
		return {
			token: accessTokenParams.get('oauth_token') || '',
			secret: accessTokenParams.get('oauth_token_secret') || '',
		};
	};

	const verifyCredentials = async () => {
		const VERIFY_CREDENTIALS_URL =
			'https://api.twitter.com/1.1/account/verify_credentials.json';
		const accessToken = await loadAccessToken();
		const oauthData = oauth.authorize(
			{
				url: VERIFY_CREDENTIALS_URL,
				method: 'GET',
			},
			{key: accessToken.token, secret: accessToken.secret},
		);
		const res = await axios.get(VERIFY_CREDENTIALS_URL, {
			headers: oauth.toHeader(oauthData),
		});
		return res.data;
	};

	const startFilterStream = async () => {
		try {
			const STATUSES_FILTER_URL =
				'https://stream.twitter.com/1.1/statuses/filter.json';
			const accessToken = await loadAccessToken();
			if (!accessToken.token || !accessToken.secret) {
				twitterRep.value = {};
				return;
			}
			const data = {
				track: twitterConfig.targetWords.join(','),
			};
			const oauthData = oauth.authorize(
				{
					url: STATUSES_FILTER_URL,
					method: 'POST',
					data,
				},
				{key: accessToken.token, secret: accessToken.secret},
			);

			const res = await axios.post<IncomingMessage>(
				STATUSES_FILTER_URL,
				undefined,
				{
					responseType: 'stream',
					headers: oauth.toHeader(oauthData),
					params: data,
				},
			);
			if (twitterStream) {
				try {
					twitterStream.destroy();
				} catch (_) {}
			}
			twitterStream = res.data;
			twitterStream.setEncoding('utf8');
		} catch (err) {
			const error: AxiosError = err;
			if (error && error.response && error.response.status === 420) {
				if (error.response.headers['x-rate-limit-reset']) {
					const resetTime =
						parseInt(
							error.response.headers['x-rate-limit-reset'],
							10,
						) * 1000;
					const remainTime = resetTime - Date.now();
					if (remainTime < 0) {
						nodecg.log.error(
							'Twitter steam api reset time is past...',
						);
					}
					nodecg.log.warn(
						`Failed to start stream API due to rate limit. Retrying in ${Math.floor(
							remainTime / 1000 / 60,
						)} minute.`,
					);
					await delay(remainTime);
				} else {
					await delay(15 * 60 * 1000);
				}
				startFilterStream();
			} else {
				nodecg.log.error('Failed to start stream API');
				nodecg.log.error(err.message);
			}
			return;
		}

		// Tweets are split when coming in through stream API
		// Store the strings until it can be parsed or gets too long
		let store = '';
		twitterStream.on('data', async (data) => {
			if (!data || typeof data !== 'string') {
				return;
			}
			if (!tweetsRep.value) {
				return;
			}
			try {
				// Try to parse the string
				store += data;
				const tweetObject = JSON.parse(store);

				// At this point the string could be parsed as JSON
				// So it's safe to clear temporary string and move on
				store = '';

				// Exclude replies, quotes, retweets
				if (
					tweetObject.in_reply_to_user_id_str ||
					tweetObject.quoted_status_id_str ||
					tweetObject.retweeted_status
				) {
					return;
				}

				const tweetAlreadyExists = tweetsRep.value.some(
					(t) => t.id === tweetObject.id_str,
				);
				if (tweetAlreadyExists) {
					return;
				}

				// Store only necessary data
				const tweet = {
					id: tweetObject.id_str,
					createdAt: new Date(tweetObject.created_at).toISOString(),
					text: tweetObject.text,
					user: {
						name: tweetObject.user.name,
						screenName: tweetObject.user.screen_name,
						profileImageUrl: new URL(
							tweetObject.user.profile_image_url_https,
						).toString(),
					},
				};

				// Insert the new tweet at the start of the list
				tweetsRep.value.unshift(tweet);
			} catch (err) {
				if (err.message !== 'Unexpected end of JSON input') {
					nodecg.log.error(err);
					return;
				}
				if (store.length > 100000) {
					store = '';
				}
			}
		});
	};

	nodecg.listenFor('twitter:startLogin', async (_, cb) => {
		if (!cb || cb.handled) {
			return;
		}

		try {
			requestToken = await getRequestToken();
			const redirectUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken.token}`;
			cb(null, redirectUrl);
		} catch (err) {
			nodecg.log.error('Failed to get Twitter oauth token');
			nodecg.log.error(err);
			cb(err);
		}
	});

	nodecg.listenFor('twitter:loginSuccess', async (data) => {
		if (data.oauthToken !== requestToken.token) {
			return;
		}
		if (!data.oauthVerifier) {
			return;
		}

		try {
			const accessToken = await getAccessToken(data.oauthVerifier);
			await saveAccessToken(accessToken);
			twitterRep.value = {userObject: await verifyCredentials()};
		} catch (err) {
			nodecg.log.error('Failed to authenticate user');
			nodecg.log.error(err);
		}
	});

	nodecg.listenFor('twitter:logout', async () => {
		if (!twitterRep.value) {
			return;
		}
		twitterRep.value.userObject = undefined;
		await saveAccessToken({token: '', secret: ''});
	});

	nodecg.listenFor('selectTweet', (id: string) => {
		const deletedTweet = deleteTweetById(id);
		if (deletedTweet) {
			nodecg.sendMessage('showTweet', deletedTweet);
		}
	});

	nodecg.listenFor('discardTweet', deleteTweetById);

	// Try to load access token file and save one if it errors
	try {
		await loadAccessToken();
	} catch (_) {
		await saveAccessToken({token: '', secret: ''});
	}

	twitterRep.on('change', async (newVal) => {
		if (newVal && newVal.userObject) {
			await startFilterStream();
			return;
		}
		if (twitterStream) {
			nodecg.log.info(
				'Twitter Replicant changed, destroying current Twitter stream',
			);
			twitterStream.destroy();
		}
	});

	tweetsRep.on('change', (newVal) => {
		if (newVal.length <= twitterConfig.maxTweets) {
			return;
		}
		tweetsRep.value =
			tweetsRep.value &&
			tweetsRep.value.slice(0, twitterConfig.maxTweets - 10);
	});
};
