/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type NextRun = null | {
	pk: number;
	index: number;
	title: string;
	englishTitle: string;
	category?: string;
	platform?: string;
	releaseYear?: number | null;
	runDuration: string;
	setupDuration: string;
	/**
	 * ゲーム全体でのカメラ使用有無
	 */
	camera?: boolean;
	runners: {
		name: string;
		twitch?: string;
		nico?: string;
		twitter?: string;
		/**
		 * 人ごとのカメラ使用有無
		 */
		camera?: boolean;
	}[];
	commentators: {
		name: string;
		twitch?: string;
		nico?: string;
		twitter?: string;
		/**
		 * 人ごとのカメラ使用有無
		 */
		camera?: boolean;
	}[];
};
