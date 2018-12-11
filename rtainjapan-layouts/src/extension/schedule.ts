import axios from 'axios';
import GoogleSpreadsheet from 'google-spreadsheet';
import cloneDeep from 'lodash/cloneDeep';
import {NodeCG} from 'nodecg/types/server';
import {Checklist, CurrentRun, NextRun, Schedule} from '../lib/replicant';

const UPDATE_INTERVAL = 60 * 1000;

const fetchHoraroSchedule = async (horaroId: string) => {
	const url = `https://horaro.org/-/api/v1/schedules/${horaroId}`;
	const {
		data: {data},
	} = await axios.get(url);
	const {columns} = data;
	const indices = {
		title: columns.indexOf('ゲームタイトル'),
		category: columns.indexOf('カテゴリ'),
		duration: columns.indexOf('予定タイム'),
		id: columns.indexOf('id'),
		runnerId: columns.indexOf('runnerId'),
		commentatorId: columns.indexOf('commentatorId'),
	};

	return data.items
		.filter(run => {
			const title = run.data[indices.title];
			return title && !title.startsWith('セットアップ');
		})
		.map((run, index) => {
			const pk: string = run.data[indices.id];
			const scheduled = run.scheduled_t * 1000;
			const title: string = run.data[indices.title];
			const category: string = run.data[indices.category];
			const duration: string = run.data[indices.duration];
			const runnerId: string = run.data[indices.runnerId];
			const commentatorId: string = run.data[indices.commentatorId];
			return {
				pk,
				index,
				scheduled,
				title,
				category,
				duration,
				runnerId: runnerId ? runnerId.split(',') : [],
				commentatorId: commentatorId ? commentatorId.split(',') : [],
			};
		});
};

const fetchRunnerInfo = async (spreadsheetId: string): Promise<any> => {
	const spreadsheet = new GoogleSpreadsheet(spreadsheetId);
	return new Promise<any>((resolve, reject) => {
		spreadsheet.getInfo((err: any, info: any) => {
			if (err) {
				reject(err);
			}
			if (!info.worksheets[0]) {
				reject(
					new Error(
						`No worksheet found from spreadsheet ${spreadsheetId}`
					)
				);
			}
			// tslint:disable-next-line no-shadowed-variable
			info.worksheets[0].getRows((err: any, rows: any[]) => {
				if (err) {
					reject(err);
				}
				resolve(
					rows.map(row => ({
						id: row.id,
						name: row.name,
						twitch: row.twitch,
						nico: row.nico,
						twitter: row.twitter,
					}))
				);
			});
		});
	});
};

export const schedule = (nodecg: NodeCG) => {
	const {horaroId, runnerSpreadsheetId} = nodecg.bundleConfig;
	if (!horaroId) {
		nodecg.log.error('Horaro ID is not provided');
		return;
	}
	if (!runnerSpreadsheetId) {
		nodecg.log.error('Runner spreadsheet is not provided');
		return;
	}

	const scheduleRep = nodecg.Replicant<Schedule>('schedule');
	const currentRunRep = nodecg.Replicant<CurrentRun>('currentRun');
	const nextRunRep = nodecg.Replicant<NextRun>('nextRun');
	const checklistRep = nodecg.Replicant<Checklist>('checklist');

	const resetChecklist = () => {
		checklistRep.value = checklistRep.value.map(item => ({
			...item,
			complete: false,
		}));
	};

	const updateCurrentRun = (index: number) => {
		resetChecklist();
		const newCurrentRun = scheduleRep.value[index];
		if (!newCurrentRun) {
			return;
		}
		currentRunRep.value = cloneDeep(newCurrentRun);
		nextRunRep.value = cloneDeep(scheduleRep.value[index + 1]);
	};

	const seekToNextRun = () => {
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

	const updateSchedule = async () => {
		const [horaroSchedule, runners] = await Promise.all([
			fetchHoraroSchedule(horaroId),
			fetchRunnerInfo(runnerSpreadsheetId),
		]);
		scheduleRep.value = horaroSchedule.map(run => {
			return {
				pk: run.pk,
				index: run.index,
				scheduled: run.scheduled,
				title: run.title || '',
				engTitle: '',
				category: run.category || '',
				hardware: '',
				duration: run.duration || '',
				runners: run.runnerId.map(runnerId =>
					runners.find((runner: any) => runner.id === runnerId)
				),
				commentators: run.commentatorId.map(commentatorId =>
					runners.find((runner: any) => runner.id === commentatorId)
				),
			};
		});
	};

	nodecg.listenFor('nextRun', (_, cb) => {
		seekToNextRun();
		if (cb && !cb.handled) {
			cb();
		}
	});

	nodecg.listenFor('previousRun', (_, cb) => {
		seekToPreviousRun();
		if (cb && !cb.handled) {
			cb();
		}
	});

	nodecg.listenFor('setCurrentRunByIndex', (index, cb) => {
		updateCurrentRun(index);
		if (cb && !cb.handled) {
			cb();
		}
	});

	nodecg.listenFor('modifyRun', (data, cb) => {
		let msg: string | null = null;

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
	});

	nodecg.listenFor('manualUpdate', () => {
		updateSchedule();
	});

	// Prevent empty current run
	scheduleRep.on('change', newVal => {
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

	updateSchedule();
	setInterval(updateSchedule, UPDATE_INTERVAL);
};
