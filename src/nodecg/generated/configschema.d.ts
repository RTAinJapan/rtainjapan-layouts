/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Configschema {
	obs?: {
		address: string;
		password: string;
	};
	tracker?: {
		domain: string;
		event: number;
		websocket: string;
		secure: boolean;
	};
	twitch?: {
		channelName: string;
		clientId: string;
		clientSecret: string;
	};
	twitter?: {
		targetWords: string[];
		bearer: string;
	};
	spotify?: {
		clientId: string;
		clientSecret: string;
	};
	googleApiKey?: string;
	commentatorSheet?: string;
	endCredit?: {
		staff: string[];
		partners: string[];
		volunteers: string[];
		text?: string[];
	};
}
