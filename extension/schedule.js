const path = require('path');
const request = require('superagent');
const clone = require('clone');

const defaultGameList = require(path.join(__dirname, 'default/game.json'));
const defaultRunnerList = require(path.join(__dirname, 'default/runner.json'));

module.exports = nodecg => {
	const replicantPesistent = !nodecg.bundleConfig.replicantDevMode;
	const scheduleRep = nodecg.Replicant('schedule');
	const horaroRep = nodecg.Replicant('horaro');
	const gameListRep = nodecg.Replicant('gameList', {defaultValue: defaultGameList, persistent: replicantPesistent});
	const runnerListRep = nodecg.Replicant('runnerList', {defaultValue: defaultRunnerList, persistent: replicantPesistent});
	const currentRunRep = nodecg.Replicant('currentRun');
	const nextRunRep = nodecg.Replicant('nextRun');

	// Listen to schedule-related events
	nodecg.listenFor('nextRun', toNextRun);
	nodecg.listenFor('previousRun', toPreviousRun);
	nodecg.listenFor('specificRun', updateCurrentRun);
	nodecg.listenFor('manualUpdate', updateHoraroSchedule);

	// Listen to replicants changes
	horaroRep.on('change', mergeSchedule);
	gameListRep.on('change', mergeSchedule);
	runnerListRep.on('change', mergeSchedule);

	// Update schedule from Horaro once NodeCG is launched
	if (nodecg.bundleConfig.horaro) {
		updateHoraroSchedule();
	} else {
		nodecg.log.warn(`Horaro schedule isn't provided. Schedule won't be updated.`);
	}

	/**
	 * Retrieves schedule from Horaro and updates schedule Replicant
	 */
	function updateHoraroSchedule() {
		const url = `https://horaro.org/-/api/v1/schedules/${nodecg.bundleConfig.horaro.scheduleId}`;
		request.get(url).end((err, res) => {
			if (err) {
				nodecg.log.error('Couldn\'t update Horaro schedule');
			} else {
				const horaroSchedule = res.body.data;
				const indexOfPk = horaroSchedule.columns.indexOf('pk');
				horaroRep.value = horaroSchedule.items.map(run => {
					return {
						pk: parseInt(run.data[indexOfPk], 10),
						scheduled: run.scheduled_t * 1000
					};
				});
				nodecg.log.info('Schedule updated from Horaro at', new Date().toLocaleString('ja-JP'));
			}
		});
	}

	/**
	 * Merges the schedule from Horaro and games list into one big schedule
	 */
	function mergeSchedule() {
		const gameList = gameListRep.value;
		const runnerList = runnerListRep.value;
		scheduleRep.value = horaroRep.value.map((horaro, index) => {
			const game = gameList.find(game => game.pk === horaro.pk);
			const {pk, startsAt} = horaro;
			const {
				title = 'セットアップ',
				category,
				hardware,
				runnerPkAry = [],
				commentatorPkAry = []
			} = game ? game : {};
			const runners = runnerPkAry.map(runnerPk => {
				const runner = runnerList.find(runner => runner.runnerPk === runnerPk);
				return {
					name: runner.name,
					twitch: runner.twitch,
					nico: runner.nico,
					twitter: runner.twitter
				};
			});
			const commentators = commentatorPkAry.map(commentatorPk => {
				const runner = runnerList.find(runner => runner.runnerPk === commentatorPk);
				return {
					name: runner.name,
					twitch: runner.twitch,
					nico: runner.nico,
					twitter: runner.twitter
				};
			});
			return {
				pk,
				index,
				startsAt,
				title,
				category,
				hardware,
				runners,
				commentators
			};
		});
	}

	/**
	 * Updates currentRun and nextRun Replicants, default is first run in the schedule
	 * @param {Number} index - Index of the current game in the schedule (Not the pk)
	 */
	function updateCurrentRun(index = 0) {
		currentRunRep.value = clone(scheduleRep.value[index]);
		nextRunRep.value = clone(scheduleRep.value[index + 1]);
	}

	/**
	 * Moves currentRun to next game
	 */
	function toNextRun() {
		updateCurrentRun(currentRunRep.value.index + 1);
	}

	/**
	 * Moves currentRun to previous game
	 */
	function toPreviousRun() {
		updateCurrentRun(currentRunRep.value.index - 1);
	}
};
