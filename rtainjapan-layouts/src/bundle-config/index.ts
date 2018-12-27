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
	googleApi: {
		spreadsheetId: string;
		clientEmail: string;
		privateKey: string;
	};
}

export default BundleConfig;
