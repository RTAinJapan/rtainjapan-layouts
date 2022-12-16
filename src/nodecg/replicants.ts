import {Checklist} from "./generated/checklist";
import {CurrentRun} from "./generated/current-run";
import {NextRun} from "./generated/next-run";
import {Schedule} from "./generated/schedule";
import {Tweets} from "./generated/tweets";
import {Timer} from "./generated/timer";
import {Spotify} from "./generated/spotify";
import {Spreadsheet} from "./generated/spreadsheet";
import {Twitch} from "./generated/twitch";
import {Obs} from "./generated/obs";
import {ObsCropInputs} from "./generated/obs-crop-inputs";
import {ObsRemoteInputs} from "./generated/obs-remote-inputs";
import {ObsStatus} from "./generated/obs-status";
import {Countdown} from "./generated/countdown";
import {CameraName} from "./generated/camera-name";
import {CameraState} from "./generated/camera-state";
import {BidWar} from "./generated/bid-war";

import type {AccessToken} from "@twurple/auth";
import {Runners} from "./generated/runners";
import {Donations} from "./generated/donations";
import {DonationQueue} from "./generated/donation-queue";

type Run = NonNullable<CurrentRun>;
type Participant = Run["runners"][number];

type Tweet = Tweets[number];
type Donation = Donations[number];

type Assets = {
	base: string;
	category: string;
	ext: string;
	name: string;
	namespace: string;
	sum: string;
	url: string;
};

type ReplicantMap = {
	checklist: Checklist;
	"current-run": CurrentRun;
	"next-run": NextRun;
	schedule: Schedule;
	spotify: Spotify;
	spreadsheet: Spreadsheet;
	timer: Timer;
	tweets: Tweets;
	twitch: Twitch;
	"obs-status": ObsStatus;
	obs: Obs;
	"obs-crop-inputs": ObsCropInputs;
	"obs-remote-inputs": ObsRemoteInputs;
	"assets:sponsor-horizontal": Assets[];
	"assets:sponsor-vertical": Assets[];
	"assets:sponsor-setup": Assets[];
	"assets:charity-logo": Assets[];
	"donation-total": number;
	countdown: Countdown;
	"camera-name": CameraName;
	"camera-state": CameraState;
	"bid-war": BidWar;
	twitchOauth: AccessToken;
	"flash-warning": boolean;
	runners: Runners;
	donations: Donations;
	"donation-queue": DonationQueue;
};

export {
	ReplicantMap,
	Checklist,
	CurrentRun,
	NextRun,
	Schedule,
	Tweets,
	Timer,
	Spotify,
	Spreadsheet,
	Twitch,
	Run,
	Participant,
	Tweet,
	Obs,
	ObsCropInputs,
	ObsRemoteInputs,
	Countdown,
	CameraName,
	CameraState,
	BidWar,
	Donations,
	Donation,
	DonationQueue,
};
