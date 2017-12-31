const twemoji = require('twemoji');
const TwitterStream = require('twitter-stream-api');

module.exports = nodecg => {
	const targetWords = nodecg.bundleConfig.twitter.targetWords;
	const twitterApi = {
		/* eslint-disable camelcase */
		consumer_key: nodecg.bundleConfig.twitter.consumerKey,
		consumer_secret: nodecg.bundleConfig.twitter.consumerSecret,
		token: nodecg.bundleConfig.twitter.accessTokenKey,
		token_secret: nodecg.bundleConfig.twitter.accessTokenSecret
		/* eslint-enable camelcase */
	};
	const tweets = nodecg.Replicant('tweets', { defaultValue: [] });

	let userStream;
	buildUserStream();

	setInterval(() => {
		nodecg.log.info('[twitter] Restarting Twitter connection');
		userStream.close();
		buildUserStream();
	}, 30 * 60 * 1000);

	nodecg.listenFor('acceptTweet', tweet => {
		if (!nodecg.bundleConfig.twitter.debug) {
			removeTweetById(tweet.id_str);
		}
		nodecg.sendMessage('showTweet', tweet);
	});

	nodecg.listenFor('rejectTweet', tweet => {
		removeTweetById(tweet.id_str);
	});

	/**
	 * Builds the stream
	 */
	function buildUserStream() {
		userStream = new TwitterStream(twitterApi);

		userStream.on('error', error => {
			nodecg.log.error('[twitter]', error.stack);
		});
		userStream.on('connection success', () => {
			nodecg.log.info('[twitter] Connection success.');
		});
		userStream.on('connection aborted', () => {
			nodecg.log.warn('[twitter] Connection aborted!');
		});
		userStream.on('connection error network', error => {
			nodecg.log.error('[twitter] Connection error network:', error.stack);
		});
		userStream.on('connection error stall', () => {
			nodecg.log.error('[twitter] Connection error stall!');
		});
		userStream.on('connection error http', httpStatusCode => {
			nodecg.log.error('[twitter] Connection error HTTP:', httpStatusCode);
		});
		userStream.on('connection rate limit', httpStatusCode => {
			nodecg.log.error('[twitter] Connection rate limit:', httpStatusCode);
		});
		userStream.on('connection error unknown', error => {
			nodecg.log.error('[twitter] Connection error unknown:', error.stack);
			userStream.close();
			userStream = new TwitterStream(twitterApi);
			userStream.stream('statuses/filter', { track: targetWords });
		});

		userStream.on('data', addTweet);
		userStream.stream('statuses/filter', { track: targetWords });
	}

	/**
	 * Adds a tweet to the queue
	 * @param {Object} tweet - The tweet object from stream API
	 */
	function addTweet(tweet) {
		if (tweet.is_quote_status) {
			return;
		}
		if (
			tweet.extended_entities &&
			tweet.extended_entities.media &&
			tweet.extended_entities.media.length > 0
		) {
			return;
		}
		if (tweet.retweeted_status) {
			return;
		}

		// Duplication check
		if (tweets.value.some(t => t.id_str === tweet.id_str)) {
			return;
		}

		tweet.text = twemoji.parse(tweet.text).replace(/\n/gi, ' ');
		tweets.value.push(tweet);
		maxTweetNumber();
	}

	/**
	 * Removes a tweet from the queue
	 * @param {String} idToRemove - ID of the tweet to remove
	 * @returns {Boolean} - Whether or not the tweet to remove was found
	 */
	function removeTweetById(idToRemove) {
		if (typeof idToRemove !== 'string') {
			throw new TypeError(
				`[twitter] Must provide a string ID when removing a tweet. ID provided was: ${idToRemove} (${typeof idToRemove})`
			);
		}
		return tweets.value.some((tweet, index) => {
			if (tweet.id_str === idToRemove) {
				tweets.value.splice(index, 1);
				maxTweetNumber();
				return true;
			}
			return false;
		});
	}

	function maxTweetNumber() {
		const tweetLength = tweets.value.length;
		if (tweetLength > 100) {
			tweets.value = tweets.value.slice(0, 100);
		}
	}
};
