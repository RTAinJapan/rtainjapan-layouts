import {Run, Runner, TimerState} from './lib';

export type Checklist = Array<{
	name: string;
	complete: boolean;
}>;

export type ChecklistCompleted = boolean;

export type CurrentRun = Run;

export type NextRun = Run;

export type GameList = Array<{
	pk: number;
	title: string;
	engTitle?: string;
	runners: string;
	commentators: string;
	category: string;
	platform: string;
	runnerPkAry: number[];
	commentatorPkAry: number[];
	duration: string;
}>;

export type RunnerList = Array<Runner & {pk: number}>;

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

export type Horaro = Array<{
	pk: number;
	scheduled: number;
}>;

export interface Timer {
	raw: number;
	hours: number;
	minutes: number;
	seconds: number;
	formatted: string;
	timestamp: number;
	timerState: TimerState;
	results: Array<Timer | null>;
	forfeit: boolean;
	place?: number;
}
