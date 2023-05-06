import {Checklist} from "./generated/checklist";
import {CurrentRun} from "./generated/current-run";
import {NextRun} from "./generated/next-run";
import {Schedule} from "./generated/schedule";
import {Tweets} from "./generated/tweets";
import {Timer} from "./generated/timer";
import {Spotify} from "./generated/spotify";
import {Spreadsheet} from "./generated/spreadsheet";
import {Obs} from "./generated/obs";
import {ObsCropInputs} from "./generated/obs-crop-inputs";
import {ObsRemoteInputs} from "./generated/obs-remote-inputs";
import {ObsStatus} from "./generated/obs-status";
import {Countdown} from "./generated/countdown";
import {CameraName} from "./generated/camera-name";
import {CameraState} from "./generated/camera-state";
import {BidWar} from "./generated/bid-war";
import {BidChallenge} from "./generated/bid-challenge";

import type {AccessToken} from "@twurple/auth";
import {Runners} from "./generated/runners";
import {Donations} from "./generated/donations";
import {DonationQueue} from "./generated/donation-queue";
import {VideoControl} from "./generated/video-control";
import {Announcements} from "./generated/announcements";
import {PlayingMusic} from "./generated/playing-music";

type Run = NonNullable<CurrentRun>;
type Runner = Run["runners"][number];
type Commentator = Runner["commentators"][number];

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
	"bid-challenge": BidChallenge;
	"video-control": VideoControl;
	"assets:interval-video": Assets[];
	announcements: Announcements;
	"playing-music": PlayingMusic;
};

export type {
	ReplicantMap,
	Checklist,
	CurrentRun,
	NextRun,
	Schedule,
	Tweets,
	Timer,
	Spotify,
	Spreadsheet,
	Run,
	Runner,
	Commentator,
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
	BidChallenge,
	Announcements,
	PlayingMusic,
};
