import {zipObject, isEqual} from 'lodash';
import {NodeCG} from '../nodecg';
import {google} from 'googleapis';
import {Participant, Schedule, Spreadsheet} from '../../nodecg/replicants';

export const importFromSpreadsheet = async (nodecg: NodeCG) => {
	const logger = new nodecg.Logger('schedule:spreadsheet');

	const {googleApiKey, spreadsheetId} = nodecg.bundleConfig;
	if (!spreadsheetId) {
		logger.warn('Spreadsheet ID is empty.');
		return;
	}
	if (!googleApiKey) {
		logger.warn('Google API Key is empty.');
		return;
	}

	logger.info('Using spreadsheet to import schedule');

	const scheduleRep = nodecg.Replicant('schedule', {defaultValue: []});
	const spreadsheetRep = nodecg.Replicant('spreadsheet', {
		defaultValue: {runs: [], runners: [], commentators: []},
	});

	const sheetsApi = google.sheets({version: 'v4', auth: googleApiKey});

	const fetchSpreadsheet = async () => {
		const res = await sheetsApi.spreadsheets.values.batchGet({
			spreadsheetId,
			ranges: ['ゲーム', '走者', '解説'],
		});
		const sheetValues = res.data.valueRanges;
		if (!sheetValues) {
			logger.error("Couldn't get values from spreadsheet");
			return;
		}
		const labelledValues = sheetValues.map((sheet) => {
			if (!sheet.values) {
				return;
			}
			const [labels, ...contents] = sheet.values;
			return contents.map((content) => zipObject(labels, content));
		});
		const newSpreadsheet = {
			runs: labelledValues[0],
			runners: labelledValues[1],
			commentators: labelledValues[2],
		};
		if (isEqual(spreadsheetRep.value, newSpreadsheet)) {
			return;
		}
		spreadsheetRep.value = newSpreadsheet as Spreadsheet;
	};

	fetchSpreadsheet();
	setInterval(fetchSpreadsheet, 10 * 1000);

	spreadsheetRep.on('change', (spreadsheet) => {
		try {
			const {runs, runners, commentators} = spreadsheet;
			const schedule: Schedule = runs.map((run, index) => {
				const runnersData: Participant[] = [];
				for (const runnerId of [
					run.runner1,
					run.runner2,
					run.runner3,
				]) {
					const runner = runners.find((r) => r.id === runnerId);
					if (runner && runner.name) {
						runnersData.push({
							name: runner.name,
							twitch: runner.twitch,
							nico: runner.nico,
							twitter: runner.twitter,
						});
					}
				}
				const commentatorData: Participant[] = [];
				for (const commentatorId of [
					run.commentator1,
					run.commentator2,
				]) {
					const commentator = commentators.find(
						(r) => r.id === commentatorId,
					);
					if (commentator && commentator.name) {
						commentatorData.push({
							name: commentator.name,
							twitch: commentator.twitch,
							nico: commentator.nico,
							twitter: commentator.twitter,
						});
					}
				}
				return {
					pk: Number(run.id),
					index,
					title: run.title,
					englishTitle: run['title english'],
					category: run.category,
					platform: run.platform,
					runDuration: run.runDuration,
					setupDuration: run.setupDuration,
					runners: runnersData,
					commentators: commentatorData,
				};
			});
			scheduleRep.value = schedule;
		} catch (err) {
			nodecg.log.error('Error while fetching schedule from spreadsheet');
			nodecg.log.error(err);
		}
	});
};
