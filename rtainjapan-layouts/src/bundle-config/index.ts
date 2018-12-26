interface BundleConfig {
	twitter: {
		targetWords: string[];
		maxTweets: number;
		consumerKey: string;
		consumerSecret: string;
	};
	twitch?: {
		targetChannel: string;
		titleTemplate: string;
	};
}

export default BundleConfig;
