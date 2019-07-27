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
	googleApi: {
		spreadsheetId: string;
		clientEmail: string;
		privateKey: string;
	};
}

export default BundleConfig;
