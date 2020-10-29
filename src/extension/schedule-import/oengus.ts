import {NodeCG} from '../nodecg';
import got from 'got';
import sampleSchedule from './oengus-sample-schedule.json';
import moment from 'moment';
import {Participant} from '../../nodecg/replicants';
import {google} from 'googleapis';
import {padStart, zipObject} from 'lodash';

const englishTitles: {[x: string]: string} = require('./english-titles.json');

type SampleRunner = typeof sampleSchedule['lines'][number]['runners'][number];

const fetchSchedule = async (): Promise<typeof sampleSchedule> => {
	const res = await got.get(
		`https://oengus.io/api/marathon/rtaijo2020/schedule`,
		{json: true},
	);
	return res.body;
};
const fetchSubmissions = async (
	token: string,
): Promise<Array<{
	user: {id: number};
	answers: Array<{question: {label: string}; answer: string | null}>;
}>> => {
	const res = await got.get(
		'https://oengus.io/api/marathon/rtaijo2020/submission/answers',
		{
			json: true,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return res.body;
};

const padZero = (num: number) => {
	return padStart(String(num), 2, '0');
};

const formatDuration = (duration: string) => {
	const momentDuration = moment.duration(duration);
	const hours = momentDuration.hours();
	const minutes = momentDuration.minutes();
	const seconds = momentDuration.seconds();
	return `${hours}:${padZero(minutes)}:${padZero(seconds)}`;
};

const extractNicoId = (str: string) => {
	const regexResult = str.match(/co\d+/);
	if (regexResult) {
		return regexResult[0];
	}
	return undefined;
};

export const importFromOengus = (nodecg: NodeCG) => {
	const logger = new nodecg.Logger('schedule:oengus');
	const {oengus, googleApiKey} = nodecg.bundleConfig;
	if (!oengus) {
		logger.warn('Oengus config is empty');
		return;
	}
	if (!googleApiKey) {
		logger.warn('Google API key config is empty');
		return;
	}

	const sheetsApi = google.sheets({
		version: 'v4',
		auth: googleApiKey,
	});
	const fetchCommentators = async () => {
		const res = await sheetsApi.spreadsheets.values.batchGet({
			spreadsheetId: nodecg.bundleConfig.oengus.commentatorSheet,
			ranges: ['フォームの回答 1'],
		});
		const sheetValues = res.data.valueRanges;
		if (!sheetValues || !sheetValues[0] || !sheetValues[0].values) {
			throw new Error('Could not get values from spreadsheet');
		}
		const [labels, ...contents] = sheetValues[0].values;
		const rawData = contents.map((content) => zipObject(labels, content));
		return rawData.map((el) => {
			return {
				name: el['名前'],
				twitter: el['Twitter ID'],
				twitch: el['Twitch ID'],
				nico: el['ニコニココミュニティ ID'],
				gameCategory: el['担当ゲームカテゴリ'],
			};
		});
	};

	logger.info('Using Oengus to import schedule');

	const scheduleRep = nodecg.Replicant('schedule', {defaultValue: []});

	const updateSchedule = async () => {
		try {
			const [schedule, submissions, rawCommentators] = await Promise.all([
				fetchSchedule(),
				fetchSubmissions(oengus.token),
				fetchCommentators(),
			]);
			scheduleRep.value = schedule.lines.map((run, index) => {
				const runners: Participant[] = (run.runners as SampleRunner[]).map(
					(runner) => {
						const submission = submissions.find(
							(sub) => sub.user.id === runner.id,
						);
						const answer =
							submission &&
							submission.answers.find((e) =>
								e.question.label.includes('niconico'),
							);
						return {
							name: runner.usernameJapanese || runner.username,
							twitch: runner.twitchName || undefined,
							twitter: runner.twitterName || undefined,
							nico:
								(answer &&
									answer.answer &&
									extractNicoId(answer.answer)) ||
								undefined,
						};
					},
				);
				const gameCategory =
					run.gameName.trim() + ' - ' + run.categoryName.trim();
				const commentators = rawCommentators.filter(
					(c) => c.gameCategory === gameCategory,
				);
				return {
					pk: run.id,
					index,
					title: run.gameName,
					englishTitle: englishTitles[run.gameName] || '',
					category: run.categoryName,
					platform: run.console,
					runDuration: formatDuration(run.estimate),
					setupDuration: formatDuration(run.setupTime),
					runners,
					commentators: commentators.map((c) => ({
						name: c.name,
						twitch: c.twitch,
						twitter: c.twitter,
						nico: c.nico,
					})),
				};
			});
		} catch (error) {
			logger.error('Failed to fetch schedule');
			logger.error(error);
		}
	};

	updateSchedule();
	setInterval(updateSchedule, 10 * 1000);
};
