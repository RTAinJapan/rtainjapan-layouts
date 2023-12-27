import {Tweets, Run, TweetsTemp} from "./replicants";

export type MessageMap = {
	showTweet: {
		data: TweetsTemp[number];
	};
	showFanArtTweet: {
		data: TweetsTemp[number];
	};
	"twitter:logout": {};
	"twitter:startLogin": {
		result: string;
		error: Error;
	};
	"twitter:loginSuccess": {
		data: {oauthToken: string | null; oauthVerifier: string | null};
	};
	"spotify:authenticated": {data: {code: string | null}};
	"spotify:login": {result: string};
	discardTweet: {data: string};
	selectTweet: {data: string};
	completeRunner: {data: {index: number; forfeit: boolean}};
	resumeRunner: {data: number};
	editTime: {data: {index: number | "master"; newTime: string}};
	startTimer: {data?: false};
	stopTimer: {};
	resetTimer: {};
	setCurrentRunByIndex: {data: number};
	nextRun: {};
	previousRun: {};
	modifyRun: {data: Run; error: string};
	toggleCheckbox: {data: {runPk: number; checkPk: string; checked: boolean}};
	resetChecklist: {};
	"obs:connect": {};
	"obs:disconnect": {};
	"obs:update": {};
	"obs:enableCrop": {};
	"obs:disableCrop": {};
	"obs:addCropInput": {data: string};
	"obs:removeCropInput": {data: string};
	"obs:setRemoteSource": {data: {input: string; index: number}};
	donation: {data: {amount: number; total: number}};
	toggleCameraName: {};
	startEndCredit: {};
	"video:init": {data: string | null};
	"video:play": {};
	"video:pause": {};
	"video:reset": {};
	"video:stop": {};
	"donation:feature": {data: number};
	"donation:cancel": {data: number};
	"donation:clear-queue": {};
};
