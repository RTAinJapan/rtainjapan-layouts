export interface Runner {
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
	runners: Runner[];
	commentators: Runner[];
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

export type ChecklistCompleted = boolean;

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
	'checklist-completed': ChecklistCompleted;
	'current-run': CurrentRun;
	'next-run': NextRun;
	schedule: Schedule;
	tweets: Tweets;
	twitter: Twitter;
	timer: Timer;
	spotify: Spotify;
	'twitch-access-token': string;
	'twitch-chennel-id': string;
};
