import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import {NodeCG} from '../../types/nodecg';
import {URLSearchParams} from 'url';
import {Twitter} from '../../types/schemas/twitter';

const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const VERIFY_CREDENTIALS_URL =
	'https://api.twitter.com/1.1/account/verify_credentials.json';

export const twitter = (nodecg: NodeCG) => {
	const callbackUrl = `http://${nodecg.config.baseURL}/bundles/${
		nodecg.bundleName
	}/twitter-callback/index.html`;

	const twitterRep = nodecg.Replicant<Twitter>('twitter');
	const twitterConfig = nodecg.bundleConfig.twitter;
	let requestToken = {
		token: '',
		secret: '',
	};
	let oauthInProgress = false;

	const oauth = new OAuth({
		consumer: {
			key: twitterConfig.consumerKey,
			secret: twitterConfig.consumerSecret,
		},
		signature_method: 'HMAC-SHA1',
		hash_function(baseString, key) {
			return crypto
				.createHmac('sha1', key)
				.update(baseString)
				.digest('base64');
		},
		realm: '',
	});

	const getRequestToken = async () => {
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

	nodecg.listenFor('getTwitterOauthUrl', async (_, cb) => {
		if (cb.handled) {
			return;
		}
		if (oauthInProgress) {
			return;
		}
		oauthInProgress = true;

		try {
			requestToken = await getRequestToken();
			cb(
				null,
				`https://api.twitter.com/oauth/authenticate?oauth_token=${
					requestToken.token
				}`
			);
		} catch (err) {
			nodecg.log.error('Failed to get Twitter oauth token');
			nodecg.log.error(err);
			oauthInProgress = false;
		}
	});

	const getAccessToken = async (oauthVerifier: string) => {
		const data = {oauth_verifier: oauthVerifier};
		const oauthData = oauth.authorize(
			{
				url: ACCESS_TOKEN_URL,
				method: 'POST',
				data: data,
			},
			{
				key: requestToken.token,
				secret: requestToken.token,
			}
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

	const verifyCredentials = async (
		accessToken: string,
		accessTokenSecret: string
	) => {
		const oauthData = oauth.authorize(
			{
				url: VERIFY_CREDENTIALS_URL,
				method: 'GET',
			},
			{key: accessToken, secret: accessTokenSecret}
		);
		const res = await axios.get(VERIFY_CREDENTIALS_URL, {
			headers: oauth.toHeader(oauthData),
		});
		return res.data;
	};

	nodecg.listenFor('twitterOauth', async (data: any) => {
		if (data.oauthToken !== requestToken) {
			return;
		}

		try {
			const accessToken = await getAccessToken(data.oauthVerifier);
			twitterRep.value.accessToken = accessToken.token;
			twitterRep.value.accessTokenSecret = accessToken.secret;
			twitterRep.value.userObject = await verifyCredentials(
				accessToken.token,
				accessToken.secret
			);
		} catch (err) {
			nodecg.log.error('Failed to authenticate user');
			nodecg.log.error(err);
		}
		oauthInProgress = false;
	});
};
