import tweetSample from './sample-json/raw-tweet.json';
import {throttle} from 'lodash';
import Twit from 'twit';
import {NodeCG} from './nodecg';
import {Tweet} from '../nodecg/replicants';

const MAX_TWEETS = 100;

export const twitter = async (nodecg: NodeCG) => {
	const logger = new nodecg.Logger('twitter');
	const streamLogger = new nodecg.Logger('twitter:stream');

	const twitterConfig = nodecg.bundleConfig.twitter;
	if (!twitterConfig) {
		logger.warn('Twitter config is empty');
		return;
	}
	if (twitterConfig.targetWords.length === 0) {
		logger.warn('Twitter tracking words are empty');
		return;
	}

	const tweetsRep = nodecg.Replicant('tweets', {defaultValue: []});
	const addTweet = (newTweet: Tweet) => {
		if (
			tweetsRep.value &&
			!tweetsRep.value.some((tweet) => tweet.id === newTweet.id)
		) {
			tweetsRep.value = [
				newTweet,
				...tweetsRep.value.slice(0, MAX_TWEETS - 1),
			];
		} else {
			tweetsRep.value = [newTweet];
		}
	};
	const twit = new Twit({
		consumer_key: twitterConfig.consumerKey,
		consumer_secret: twitterConfig.consumerSecret,
		access_token: twitterConfig.accessToken,
		access_token_secret: twitterConfig.accessTokenSecret,
	});

	/**
	 * Incoming stream from Twitter
	 */
	let stream: Twit.Stream | null = null;

	const startStream = throttle(() => {
		try {
			if (stream) {
				stream.stop();
			}

			stream = twit.stream('statuses/filter', {
				track: twitterConfig.targetWords,
			});

			stream.on('tweet', (rawTweet: typeof tweetSample) => {
				if (
					rawTweet.retweeted_status ||
					rawTweet.quoted_status ||
					rawTweet.in_reply_to_user_id
				) {
					return;
				}

				const newTweet: Tweet = {
					id: rawTweet.id_str,
					user: {
						profileImageUrl: rawTweet.user.profile_image_url_https,
						name: rawTweet.user.name,
						screenName: rawTweet.user.screen_name,
					},
					text: rawTweet.text
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>'),
					createdAt: new Date(rawTweet.created_at).toISOString(),
				};
				addTweet(newTweet);
			});
			stream.on('disconnect', (msg) => {
				streamLogger.error('disconnected', msg);
				startStream();
			});
			stream.on('connect', () => {
				streamLogger.warn('connecting');
			});
			stream.on('reconnect', (_req, _res, connectInterval: number) => {
				// Twitter is having problems or we get rate limited. Reconnetion scheduled.
				streamLogger.warn(`Reconnecting in ${connectInterval}ms`);
			});
			stream.on('connected', () => {
				streamLogger.warn('connected');
			});
			stream.on('warning', (warnMsg) => {
				// Stream is stalling
				streamLogger.warn('Warning:', warnMsg);
			});
			stream.on(
				'error',
				(error: {
					message: string;
					statusCode: string;
					code: string;
					twitterReply: string;
					allErrors: string;
				}) => {
					streamLogger.error(error);
				},
			);
		} catch (error) {
			streamLogger.error('Failed to start stream:', error.stack);
			startStream();
		}
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

	nodecg.listenFor('selectTweet', (id: string) => {
		const deletedTweet = deleteTweetById(id);
		if (deletedTweet) {
			nodecg.sendMessage('showTweet', deletedTweet);
		}
	});

	nodecg.listenFor('discardTweet', deleteTweetById);

	startStream();
};
