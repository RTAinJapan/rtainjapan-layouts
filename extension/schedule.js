const request = require('superagent');
const clone = require('clone');

const defaultGameList = require('./default/games.json');
const defaultRunnerList = require('./default/runners.json');

const UPDATE_INTERVAL = 60 * 1000;

module.exports = nodecg => {
	const horaroRep = nodecg.Replicant('horaro');
	const gameListRep = nodecg.Replicant('gameList', {
		defaultValue: defaultGameList
	});
	const runnerListRep = nodecg.Replicant('runnerList', {
		defaultValue: defaultRunnerList
	});
	const scheduleRep = nodecg.Replicant('schedule');
	const currentRunRep = nodecg.Replicant('currentRun');
	const nextRunRep = nodecg.Replicant('nextRun');

	const horaroId = nodecg.bundleConfig.horaroId;

	let updateInterval;

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

	nodecg.listenFor('nextRun', (data, cb) => {
		seekToNextRun();
		if (typeof cb === 'function') {
			cb();
		}
	});
	nodecg.listenFor('previousRun', (data, cb) => {
		seekToPreviousRun();
		if (typeof cb === 'function') {
			cb();
		}
	});
	nodecg.listenFor('setCurrentRunByIndex', (index, cb) => {
		updateCurrentRun(index);
		if (typeof cb === 'function') {
			cb();
		}
	});
	nodecg.listenFor('manualUpdate', (data, cb) => {
		fetchHoraroSchedule();
		if (typeof cb === 'function') {
			cb();
		}
	});
	nodecg.listenFor('modifyRun', (data, cb) => {
		if (currentRunRep.value.pk === data.pk) {
			Object.assign(currentRunRep.value, data);
		} else if (nextRunRep.value.pk === data.pk) {
			Object.assign(nextRunRep.value, data);
		} else {
			nodecg.log.warn('[modifyRun] run not found:', data);
		}

		if (typeof cb === 'function') {
			cb();
		}
	});

	function updateHoraroSchedule() {
		const url = `https://horaro.org/-/api/v1/schedules/${horaroId}`;
		request.get(url).end((err, { body: { data: horaroSchedule } }) => {
			if (err) {
				nodecg.log.error("Couldn't update Horaro schedule");
			} else {
				// Update horaro schedule
				const indexOfPk = horaroSchedule.columns.indexOf('pk');
				const horaroData = horaroSchedule.items.map(
					({ data, scheduled_t: scheduled }) => ({
						pk: parseInt(data[indexOfPk], 10),
						scheduled: scheduled * 1000 // Convert to UNIX time
					})
				);
				const horaroUpdated = horaroData.some(
					(game, index) =>
						game.pk !== horaroRep.value[index].pk ||
						game.scheduled !== horaroRep.value[index].scheduled
				);
				if (horaroUpdated) {
					horaroRep.value = horaroData;
					nodecg.log.info(
						`Schedule updated from Horaro at ${new Date().toLocaleString()}`
					);
				}
			}
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

		// Return if Horaro schdule is empty
		if (!horaroRep.value) {
			return;
		}

		scheduleRep.value = horaroRep.value.map(({ pk, scheduled }, index) => {
			// Find the game on game list
			const game = gameList.find(game => game.pk === pk) || {};
			const {
				title,
				engTitle,
				category,
				hardware,
				duration,
				runnerPkAry = [],
				commentatorPkAry = []
			} = game;

			// Find runner info
			const runners = runnerPkAry.map(runnerPk => {
				const runner = runnerList.find(runner => runner.pk === runnerPk) || {};
				return {
					name: runner.name,
					twitch: runner.twitch,
					nico: runner.nico,
					twitter: runner.twitter
				};
			});

			// Find commentator info
			const commentators = commentatorPkAry.map(commentatorPk => {
				const commentator =
					runnerList.find(runner => runner.pk === commentatorPk) || {};
				return {
					name: commentator.name,
					twitch: commentator.twitch,
					nico: commentator.nico,
					twitter: commentator.twitter
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
				commentators
			};
		});

		// Put first game to current game if no current game exists
		if (!currentRunRep.value.pk) {
			updateCurrentRun(0);
		}
	}

	/**
	 * Updates currentRun and nextRun Replicants, default is first run in the schedule
	 * @param {Number} index - Index of the current game in the schedule (Not the pk)
	 */
	function updateCurrentRun(index) {
		if (index === undefined && currentRunRep.value.pk) {
			index = currentRunRep.value.index;
		}
		if (index < 0 || index > scheduleRep.value.length) {
			return;
		}
		currentRunRep.value = clone(scheduleRep.value[index]);
		nextRunRep.value = clone(scheduleRep.value[index + 1]);
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
