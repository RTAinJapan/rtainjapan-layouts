const path = require('path');

const TimeObject = require(path.join(__dirname, '../shared/classes/time-object'));

const TRY_TICK_INTERVAL = 100;

const defaultStopwatch = () => {
	const to = new TimeObject(0);
	to.state = 0;
	to.results = [null, null, null, null];
	return to;
};

module.exports = nodecg => {
	// Requires checklist.js to be loaded
	const checklistComplete = nodecg.Replicant('checklistComplete');
	// Requires schedule.js to be loaded
	const currentRun = nodecg.Replicant('currentRun');
	const stopwatch = nodecg.Replicant('stopwatch', {defaultValue: defaultStopwatch()});
	// The UNIX time when the timer incremented last time
	let lastIncrement;
	// Keeps the timeout object
	let tickInterval;

	// If the timer was running when NodeCG was shut down last time,
	// resume the timer according to how long it has been since the shutdown time.
	if (stopwatch.value.state === 1) {
		const missedSeconds = Math.round((Date.now() - stopwatch.value.timestamp) / 1000);
		TimeObject.setSeconds(stopwatch.value, stopwatch.value.raw + missedSeconds);
		start(true);
	}

	// Listen to start/stop/reset event from master timer
	nodecg.listenFor('startTimer', start);
	nodecg.listenFor('stopTimer', stop);
	nodecg.listenFor('resetTimer', reset);
	// Listen to completeRunner event for a runner, or all runners if it's coop
	// @param data = {index, forfeit}
	nodecg.listenFor('completeRunner', data => {
		if (currentRun.value.coop) {
			completeAllRunners(data.forfeit);
		} else {
			completeRunner(data);
		}
	});
	// Listen to resumeRunner event for a runner, or all runners if it's coop
	nodecg.listenFor('resumeRunner', index => {
		if (currentRun.value.coop) {
			resumeAllRunners();
		} else {
			resumeRunner(index);
		}
	});
	// Listen to editTime event
	// @param {index, newTime}
	nodecg.listenFor('editTime', editTime);

	/**
	 * Increments the timer by one second if at least one second
	 * has passed since the last incerement.
	 * If it does, increament lastIncerement for 1000.
	 * Executing this function makes the timer very accurate to UNIX time,
	 * and can be easily extended to millisecond timer.
	 */
	function tryTick() {
		if (Date.now() - lastIncrement > 1000) {
			lastIncrement += 1000;
			TimeObject.increment(stopwatch.value);
		}
	}

	/**
	 * Starts the timer.
	 * @param {Boolean} force - Forces the timer to start again, even if already running.
	 */
	function start(force) {
		if (!checklistComplete) {
			return;
		}

		if (!force && stopwatch.value.state === 1) {
			return;
		}

		clearInterval(tickInterval);
		stopwatch.value.state = 1;
		tickInterval = setInterval(tryTick, TRY_TICK_INTERVAL);
	}

	/**
	 * Stops the timer.
	 */
	function stop() {
		clearInterval(tickInterval);
		stopwatch.value.state = 0;
	}

	/**
	 * Stops and resets the timer, and clears the timer and results.
	 */
	function reset() {
		stop();
		TimeObject.setSeconds(stopwatch.value, 0);
		stopwatch.value.result = [null, null, null, null];
	}

	/**
	 * Marks a runner as complete.
	 * @param {Number} data.index - The runner to modify.
	 * @param {Boolean} data.forfeit - Whether or not the runner forfeit.
	 */
	function completeRunner(data) {
		if (!stopwatch.value.results[data.index]) {
			stopwatch.value.results[data.index] = new TimeObject(stopwatch.value.raw);
		}
		stopwatch.value.results[data.index].forfeit = data.forfeit;
		recalcPlaces();
	}

	/**
	 * Marks all runners as complete.
	 * @param {Boolean} forfeit - Whether or not the runners forfeit.
	 */
	function completeAllRunners(forfeit) {
		currentRun.value.runners.forEach((r, index) => {
			completeRunner({index, forfeit});
		});
	}

	/**
	 * Marks a runner as still running.
	 * @param {Number} index - The runner to modify.
	 */
	function resumeRunner(index) {
		stopwatch.value.results[index] = null;
		recalcPlaces();
		if (stopwatch.value.state === 2) {
			const missedSeconds = Math.round((Date.now() - stopwatch.value.timestamp) / 1000);
			TimeObject.setSeconds(stopwatch.value, stopwatch.value.raw + missedSeconds);
			start();
		}
	}

	/**
	 * Marks all runners as still running.
	 */
	function resumeAllRunners() {
		currentRun.value.runners.forEach((r, index) => {
			resumeRunner(index);
		});
	}

	/**
	 * Edits the final time of a results.
	 * @param {Number} index - The runner to modify time of.
	 * @param {String} newTime - A hh:mm:ss/mm:ss formatted new time.
	 */
	function editTime(index, newTime) {
		if (!newTime) {
			return;
		}

		const newSeconds = TimeObject.parseSeconds(newTime);
		if (isNaN(newSeconds)) {
			return;
		}

		if (index === 'master') {
			TimeObject.setSeconds(stopwatch.value, newSeconds);
		} else if (stopwatch.value.results[index]) {
			TimeObject.setSeconds(stopwatch.value.results[index], newSeconds);
			recalcPlaces();
			if (currentRun.value.runners.length === 1) {
				TimeObject.setSeconds(stopwatch.value, newSeconds);
			}
		}
	}

	/**
	 * Re-calculates the podium place for all runners.
	 */
	function recalcPlaces() {
		const finishedResults = stopwatch.value.results
			.filter(result => {
				if (result) {
					result.place = 0;
					return !result.forfeit;
				}
				return false;
			})
			.sort((a, b) => a.raw - b.raw);
		finishedResults.forEach((r, index) => {
			r.place = index + 1;
		});

		const allRunnersFinished = currentRun.value.runners.every((r, index) => stopwatch.value.results[index]);
		if (allRunnersFinished) {
			stop();
			stopwatch.value.state = 2;
		}
	}
};
