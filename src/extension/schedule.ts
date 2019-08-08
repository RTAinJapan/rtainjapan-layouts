import {zipObject} from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import {NodeCG} from './nodecg';
import {google} from 'googleapis';
import {Participant, Schedule} from '../nodecg/replicants';

export default async (nodecg: NodeCG) => {
	const logger = new nodecg.Logger('schedule');

	const {googleApiKey, spreadsheetId} = nodecg.bundleConfig;
	if (!spreadsheetId) {
		logger.warn('Spreadsheet ID is empty.');
		return;
	}
	if (!googleApiKey) {
		logger.warn('Google API Key is empty.');
		return;
	}

	const scheduleRep = nodecg.Replicant('schedule');
	const currentRunRep = nodecg.Replicant('current-run');
	const nextRunRep = nodecg.Replicant('next-run');
	const checklistRep = nodecg.Replicant('checklist');
	const spreadsheetRep = nodecg.Replicant('spreadsheet');

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
		spreadsheetRep.value = {
			runs: labelledValues[0],
			runners: labelledValues[1],
			commentators: labelledValues[2],
		} as any;
	};

	const resetChecklist = () => {
		if (checklistRep.value) {
			checklistRep.value = checklistRep.value.map((item) => ({
				...item,
				complete: false,
			}));
		}
	};

	const updateCurrentRun = (index: number) => {
		if (!scheduleRep.value) {
			return;
		}
		resetChecklist();
		const newCurrentRun = scheduleRep.value[index];
		if (!newCurrentRun) {
			return;
		}
		currentRunRep.value = cloneDeep(newCurrentRun);
		nextRunRep.value = cloneDeep(scheduleRep.value[index + 1]);
	};

	const seekToNextRun = () => {
		if (!currentRunRep.value || !scheduleRep.value) {
			return;
		}
		const currentIndex = currentRunRep.value.index;
		if (currentIndex === undefined || currentIndex < 0) {
			updateCurrentRun(0);
			return;
		}
		if (currentIndex >= scheduleRep.value.length - 1) {
			return;
		}
		resetChecklist();
		currentRunRep.value = cloneDeep(nextRunRep.value);
		nextRunRep.value = cloneDeep(scheduleRep.value[currentIndex + 2]);
	};

	const seekToPreviousRun = () => {
		if (!currentRunRep.value || !scheduleRep.value) {
			return;
		}
		const currentIndex = currentRunRep.value.index;
		if (currentIndex === undefined || currentIndex < 0) {
			updateCurrentRun(0);
			return;
		}
		if (currentIndex === 0) {
			return;
		}
		resetChecklist();
		nextRunRep.value = cloneDeep(currentRunRep.value);
		currentRunRep.value = cloneDeep(scheduleRep.value[currentIndex - 1]);
	};

	nodecg.listenFor('nextRun', (_, cb) => {
		seekToNextRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('previousRun', (_, cb) => {
		seekToPreviousRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('setCurrentRunByIndex', (index, cb) => {
		updateCurrentRun(index);
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('modifyRun', (data, cb) => {
		if (!currentRunRep.value || !nextRunRep.value) {
			return;
		}

		let msg: string | null = null;

		try {
			switch (data.pk) {
				case currentRunRep.value.pk:
					currentRunRep.value = {...currentRunRep.value, ...data};
					break;
				case nextRunRep.value.pk:
					nextRunRep.value = {...nextRunRep.value, ...data};
					break;
				default:
					nodecg.log.warn('[modifyRun] run not found:', data);
					msg = 'Error: Run not found';
					break;
			}
			if (cb && !cb.handled) {
				cb(msg);
			}
		} catch (error) {
			if (cb && !cb.handled) {
				cb(error.message);
			}
		}
	});

	// Prevent empty current run
	scheduleRep.on('change', (newVal) => {
		const isCurrentRunEmpty =
			!currentRunRep.value || !currentRunRep.value.pk;
		if (isCurrentRunEmpty) {
			const currentRun = newVal[0];
			if (currentRun) {
				currentRunRep.value = cloneDeep(currentRun);
				nextRunRep.value = cloneDeep(newVal[1]);
			}
		}
	});

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
					if (runner) {
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
					if (commentator) {
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
					scheduled: new Date().getTime(),
					title: run.title,
					category: run.category,
					platform: run.platform,
					duration: run.runDuration,
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
