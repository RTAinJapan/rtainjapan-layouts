import {NodeCG} from "./nodecg";
import {Tweet} from "../nodecg/replicants";
import {
	ETwitterStreamEvent,
	TweetStream,
	TweetV2SingleStreamResult,
	TwitterApi,
} from "twitter-api-v2";

const MAX_TWEETS = 100;

export const twitter = async (nodecg: NodeCG) => {
	const logger = new nodecg.Logger("twitter");
	const streamLogger = new nodecg.Logger("twitter:stream");

	const twitterConfig = nodecg.bundleConfig.twitter;
	if (!twitterConfig) {
		logger.warn("Twitter config is empty");
		return;
	}
	if (twitterConfig.targetWords.length === 0) {
		logger.warn("Twitter tracking words are empty");
		return;
	}

	const tweetsRep = nodecg.Replicant("tweets");
	const addTweet = (newTweet: Tweet) => {
		if (
			tweetsRep.value &&
			!tweetsRep.value.some((tweet) => tweet.id === newTweet.id)
		) {
			tweetsRep.value = [newTweet, ...tweetsRep.value.slice(0, MAX_TWEETS - 1)];
		} else {
			tweetsRep.value = [newTweet];
		}
	};

	const twitterApi = new TwitterApi(twitterConfig.bearer);

	// Reset rules
	const rules = await twitterApi.v2.streamRules();

	const ruleIds = rules.data
		?.map((rule) => rule.id)
		?.filter((id): id is string => {
			return !!id;
		});

	if (ruleIds) {
		await twitterApi.v2.updateStreamRules({
			delete: {
				ids: ruleIds,
			},
		});
	}

	const resultRules = await twitterApi.v2.updateStreamRules({
		add: [
			{
				value: `(${twitterConfig.targetWords.join(
					" OR ",
				)}) -is:retweet -is:reply -is:quote`,
			},
		],
	});

	logger.info(`created rules: ${JSON.stringify(resultRules?.meta?.summary)}`);

	/**
	 * Incoming stream from Twitter
	 */
	let stream: TweetStream<TweetV2SingleStreamResult> | null = null;

	const startStream = async () => {
		try {
			if (stream) {
				stream.close();
			}

			stream = await twitterApi.v2.searchStream({
				autoConnect: false,
				expansions: ["author_id"],
				"tweet.fields": ["created_at"],
				"user.fields": ["profile_image_url", "name", "username"],
			});

			stream.on(ETwitterStreamEvent.Data, ({data, includes}) => {
				if (
					data.referenced_tweets?.some(
						(ref) =>
							ref.type === "retweeted" ||
							ref.type === "quoted" ||
							ref.type === "replied_to",
					)
				) {
					return;
				}

				const author = includes?.users?.find((u) => u.id === data.author_id);
				if (!author || !author.profile_image_url || !data.created_at) {
					return;
				}
				const newTweet: Tweet = {
					id: data.id,
					user: {
						profileImageUrl: author.profile_image_url,
						name: author.name,
						screenName: author.username,
					},
					text: data.text.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
					createdAt: new Date(data.created_at).toISOString(),
				};
				addTweet(newTweet);
			});

			stream.on(ETwitterStreamEvent.ConnectionClosed, () => {
				streamLogger.error("disconnected");
				startStream();
			});
			stream.on(ETwitterStreamEvent.ReconnectAttempt, (attempt: number) => {
				// Twitter is having problems or we get rate limited. Reconnetion scheduled.
				streamLogger.warn(`Reconnecting attempt ${attempt}`);
			});
			stream.on(ETwitterStreamEvent.Connected, () => {
				streamLogger.warn("connected");
			});
			stream.on(ETwitterStreamEvent.ConnectionLost, () => {
				// Stream is stalling
				streamLogger.warn("lost stream connection");
			});
			stream.on(ETwitterStreamEvent.Error, (error) => {
				streamLogger.error(error);
			});

			stream.connect();
		} catch (error) {
			if (error instanceof Error) {
				streamLogger.error("Failed to start stream:", error.stack);
			}
			await startStream();
		}
	};

	const deleteTweetById = (id: string) => {
		if (!tweetsRep.value) {
			return;
		}
		const selectedTweetIndex = tweetsRep.value.findIndex((t) => t.id === id);
		if (selectedTweetIndex === -1) {
			return undefined;
		}
		const tweet = tweetsRep.value[selectedTweetIndex];
		tweetsRep.value.splice(selectedTweetIndex, 1);
		return tweet;
	};

	nodecg.listenFor("selectTweet", (id: string) => {
		const deletedTweet = deleteTweetById(id);
		if (deletedTweet) {
			nodecg.sendMessage("showTweet", deletedTweet);
		}
	});

	nodecg.listenFor("discardTweet", deleteTweetById);

	await startStream();
};
