import {Checklist} from './generated/checklist';
import {CurrentRun} from './generated/current-run';
import {NextRun} from './generated/next-run';
import {Schedule} from './generated/schedule';
import {Tweets} from './generated/tweets';
import {Timer} from './generated/timer';
import {Spotify} from './generated/spotify';
import {Spreadsheet} from './generated/spreadsheet';
import {Twitch} from './generated/twitch';

type Run = NonNullable<CurrentRun>;
type Participant = Run['runners'][number];

type Tweet = Tweets[number];

type ReplicantMap = {
	checklist: Checklist;
	'current-run': CurrentRun;
	'next-run': NextRun;
	schedule: Schedule;
	spotify: Spotify;
	spreadsheet: Spreadsheet;
	timer: Timer;
	tweets: Tweets;
	twitch: Twitch;
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
};
