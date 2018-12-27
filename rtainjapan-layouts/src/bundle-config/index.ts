interface BundleConfig {
	twitter: {
		targetWords: string[];
		maxTweets: number;
		consumerKey: string;
		consumerSecret: string;
	};
	spotify: {
		clientId: string;
		clientSecret: string;
	};
	twitch?: {
		targetChannel: string;
		titleTemplate: string;
	};
}

export default BundleConfig;
