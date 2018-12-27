import {Run, Runner, TimerState} from './lib';

export {Run, Runner, TimerState};

export enum ReplicantName {
	Checklist = 'Checklist',
	ChecklistCompleted = 'ChecklistCompleted',
	CurrentRun = 'CurrentRun',
	NextRun = 'NextRun',
	Schedule = 'Schedule',
	Tweets = 'Tweets',
	Twitter = 'Twitter',
	Timer = 'Timer',
	Spotify = 'Spotify',
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
