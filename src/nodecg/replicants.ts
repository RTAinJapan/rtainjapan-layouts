export interface Spreadsheet {
	runs: {
		id: string;
		title: string;
		['title english']: string;
		platform?: string;
		category?: string;
		runDuration: string;
		setupDuration: string;
		runner1: string;
		runner2: string;
		runner3: string;
		commentator1: string;
		commentator2: string;
	}[];
	runners: {
		id: string;
		name: string;
		twitter?: string;
		nico?: string;
		twitch?: string;
	}[];
	commentators: {
		id: string;
		name: string;
		twitter?: string;
		nico?: string;
		twitch?: string;
	}[];
}

export interface Participant {
	name: string;
	twitch?: string;
	nico?: string;
	twitter?: string;
}

export interface Run {
	pk: number;
	index: number;
	scheduled: number;
	title: string;
	category?: string;
	platform?: string;
	duration: string;
	runners: Participant[];
	commentators: Participant[];
}

export enum TimerState {
	Stopped = 'Stopped',
	Running = 'Running',
	Finished = 'Finished',
}

export type Checklist = Array<{
	name: string;
	complete: boolean;
}>;

export type CurrentRun = Run;

export type NextRun = Run;

export type Schedule = Run[];

export type Tweets = Array<{
	id: string;
	createdAt: string;
	text: string;
	user: {
		name: string;
		screenName: string;
		profileImageUrl: string;
	};
}>;

export interface Twitter {
	userObject?: {
		[k: string]: any;
	};
}

export interface Timer {
	raw: number;
	hours: number;
	minutes: number;
	seconds: number;
	formatted: string;
	timestamp: number;
	timerState: TimerState;
	results: any[];
	forfeit: boolean;
	place?: number;
}

export interface Spotify {
	currentTrack?: {
		name: string;
		artists: string;
	};
}

export type ReplicantMap = {
	checklist: Checklist;
	'current-run': CurrentRun;
	'next-run': NextRun;
	schedule: Schedule;
	tweets: Tweets;
	twitter: Twitter;
	timer: Timer;
	spotify: Spotify;
	'twitch-access-token': string;
	'twitch-chennel-id': string;
	spreadsheet: Spreadsheet;
};
