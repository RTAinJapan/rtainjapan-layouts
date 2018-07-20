import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';

import defaultGameList from './default/games.json';
import defaultRunnerList from './default/runners.json';
import {NodeCG} from '../../types/nodecg';
import {Horaro} from '../../types/schemas/horaro';
import {GameList} from '../../types/schemas/gameList';
import {RunnerList} from '../../types/schemas/runnerList';
import {Schedule} from '../../types/schemas/schedule';
import {CurrentRun} from '../../types/schemas/currentRun';
import {NextRun} from '../../types/schemas/nextRun';
import {ModifyRun} from '../../types/messages';
import {HoraroApi} from '../../types/bundle';

const UPDATE_INTERVAL = 60 * 1000;

export const schedule = (nodecg: NodeCG) => {
	const horaroRep = nodecg.Replicant<Horaro>('horaro');
	const gameListRep = nodecg.Replicant<GameList>('gameList', {
		defaultValue: defaultGameList,
	});
	const runnerListRep = nodecg.Replicant<RunnerList>('runnerList', {
		defaultValue: defaultRunnerList,
	});
	const scheduleRep = nodecg.Replicant<Schedule>('schedule');
	const currentRunRep = nodecg.Replicant<CurrentRun>('currentRun');
	const nextRunRep = nodecg.Replicant<NextRun>('nextRun');

	const horaroId = nodecg.bundleConfig.horaroId;

	let updateInterval: NodeJS.Timer;

	if (horaroId) {
		updateHoraroSchedule();
		setUpdateInterval();
	} else {
		nodecg.log.warn(
			'Schedule update is disabled since Horaro schedule is not provided.'
		);
	}

	horaroRep.on('change', mergeSchedule);
	gameListRep.on('change', mergeSchedule);
	runnerListRep.on('change', mergeSchedule);

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
	nodecg.listenFor('manualUpdate', (_, cb) => {
		fetchHoraroSchedule();
		if (cb && !cb.handled) {
			cb();
		}
	});
	nodecg.listenFor<ModifyRun>('modifyRun', (data, cb) => {
		if (currentRunRep.value.pk === data.pk) {
			Object.assign(currentRunRep.value, data);
		} else if (nextRunRep.value.pk === data.pk) {
			Object.assign(nextRunRep.value, data);
		} else {
			nodecg.log.warn('[modifyRun] run not found:', data);
		}

		if (cb && !cb.handled) {
			cb();
		}
	});

	function updateHoraroSchedule() {
		const url = `https://horaro.org/-/api/v1/schedules/${horaroId}`;
		(async () => {
			const {
				data: {data: horaroSchedule},
			} = await axios.get<HoraroApi>(url);
			// Update horaro schedule
			const indexOfPk = horaroSchedule.columns.indexOf('pk');
			const horaroData = horaroSchedule.items.map(
				({data, scheduled_t: scheduled}) => ({
					pk: parseInt(data[indexOfPk], 10),
					scheduled: scheduled * 1000, // Convert to UNIX time
				})
			);
			const horaroUpdated = horaroData.some(
				(game, index) =>
					game.pk !== horaroRep.value[index].pk ||
					game.scheduled !== horaroRep.value[index].scheduled
			);
			if (!horaroUpdated) {
				return;
			}
			horaroRep.value = horaroData;
			nodecg.log.info(
				`Schedule updated from Horaro at ${new Date().toLocaleString()}`
			);
		})().catch(err => {
			nodecg.log.error("Couldn't update Horaro schedule");
			nodecg.log.error(err);
		});
	}

	function fetchHoraroSchedule() {
		updateHoraroSchedule();
		clearUpdateInterval();
		setUpdateInterval();
	}

	function mergeSchedule() {
		const gameList = gameListRep.value;
		const runnerList = runnerListRep.value;

		// Return if Horaro schedule is empty
		if (horaroRep.value.length === 0) {
			return;
		}

		scheduleRep.value = horaroRep.value.map(({pk, scheduled}, index) => {
			// Find the game on game list
			const game = gameList.find(g => g.pk === pk) || {};
			const {
				title,
				engTitle,
				category,
				hardware,
				duration,
				runnerPkAry = [],
				commentatorPkAry = [],
			} = game;

			// Find runner info
			const runners = runnerPkAry.map(runnerPk => {
				const runner = runnerList.find(r => r.pk === runnerPk) || {};
				return {
					name: runner.name,
					twitch: runner.twitch,
					nico: runner.nico,
					twitter: runner.twitter,
				};
			});

			// Find commentator info
			const commentators = commentatorPkAry.map(commentatorPk => {
				const commentator =
					runnerList.find(runner => runner.pk === commentatorPk) ||
					{};
				return {
					name: commentator.name,
					twitch: commentator.twitch,
					nico: commentator.nico,
					twitter: commentator.twitter,
				};
			});

			return {
				pk,
				index,
				scheduled,
				title,
				engTitle,
				category,
				hardware,
				duration,
				runners,
				commentators,
			};
		});

		// Put first game to current game if no current game exists
		if (!currentRunRep.value.pk) {
			updateCurrentRun(0);
		} else {
			updateCurrentRun();
		}
	}

	function updateCurrentRun(index = currentRunRep.value.index) {
		if (index < 0 || index > scheduleRep.value.length) {
			return;
		}
		currentRunRep.value = cloneDeep(scheduleRep.value[index]);
		nextRunRep.value = cloneDeep(scheduleRep.value[index + 1]);
	}

	function seekToNextRun() {
		updateCurrentRun(currentRunRep.value.index + 1);
	}

	function seekToPreviousRun() {
		updateCurrentRun(currentRunRep.value.index - 1);
	}

	function setUpdateInterval() {
		updateInterval = setInterval(updateHoraroSchedule, UPDATE_INTERVAL);
	}

	function clearUpdateInterval() {
		clearInterval(updateInterval);
	}
};
