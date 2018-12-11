export interface BundleConfig {
	horaroId?: string;
	runnerSpreadsheetId?: string;
	twitter: {
		targetWords: string[];
		maxTweets: number;
		consumerKey: string;
		consumerSecret: string;
	};
	twitch: {
		targetChannel: string;
		titleTemplate: string;
	};
}
