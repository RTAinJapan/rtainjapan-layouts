import {Tweets, Run} from './replicants';

export type MessageMap = {
	showTweet: {
		data: Tweets[number];
	};
	'twitter:logout': {};
	'twitter:startLogin': {
		result: string;
		error: Error;
	};
	'twitter:loginSuccess': {
		data: {oauthToken: string | null; oauthVerifier: string | null};
	};
	'spotify:authenticated': {data: {code: string | null}};
	'spotify:login': {result: string};
	discardTweet: {data: string};
	selectTweet: {data: string};
	completeRunner: {data: {index: number; forfeit: boolean}};
	resumeRunner: {data: number};
	editTime: {data: {index: number | 'master'; newTime: string}};
	startTimer: {data?: false};
	stopTimer: {};
	resetTimer: {};
	setCurrentRunByIndex: {data: number};
	nextRun: {};
	previousRun: {};
	modifyRun: {data: Run; error: string};
	toggleCheckbox: {data: {name: string; checked: boolean}};
	resetChecklist: {};
};
