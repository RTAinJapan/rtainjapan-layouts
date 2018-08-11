import {NodeCG} from '../../types/nodecg';
import {CurrentRun} from '../../types/schemas/currentRun';
import {ChecklistCompleted} from '../../types/schemas/checklistCompleted';
import {TimeObject, TimerState} from '../lib/time-object';

const TRY_TICK_INTERVAL = 10;

const defaultStopwatch = () => new TimeObject(0);

export const timekeeping = (nodecg: NodeCG) => {
	const checklistCompleteRep = nodecg.Replicant<ChecklistCompleted>(
		'checklistComplete'
	);
	const currentRunRep = nodecg.Replicant<CurrentRun>('currentRun');
	const stopwatchRep = nodecg.Replicant<TimeObject>('stopwatch', {
		defaultValue: defaultStopwatch(),
	});

	// The UNIX time when the timer incremented last time
	let lastIncrement: number;
	// Keeps the timeout object
	let tickInterval: NodeJS.Timer;

	/**
	 * If the timer was running when NodeCG was shut down last time,
	 * resume the timer according to how long it has been since the shutdown time.
	 */
	if (stopwatchRep.value.timerState === TimerState.Running) {
		const missedSeconds = Math.round(
			(Date.now() - stopwatchRep.value.timestamp) / 1000
		);
		TimeObject.setSeconds(
			stopwatchRep.value,
			stopwatchRep.value.raw + missedSeconds
		);
		start(true);
	}

	// Listen to start/stop/reset event from master timer
	nodecg.listenFor('startTimer', start);
	nodecg.listenFor('stopTimer', stop);
	nodecg.listenFor('resetTimer', reset);

	// Listen to completeRunner event for a runner
	// @param data = {index, forfeit}
	nodecg.listenFor('completeRunner', completeRunner);

	// Listen to resumeRunner event for a runner
	nodecg.listenFor('resumeRunner', resumeRunner);

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
			TimeObject.increment(stopwatchRep.value);
		}
	}

	/**
	 * Starts the timer.
	 * @param force - Forces the timer to start again, even if already running.
	 */
	function start(force = false) {
		if (!checklistCompleteRep.value) {
			return;
		}

		if (!force && stopwatchRep.value.timerState === TimerState.Running) {
			return;
		}

		clearInterval(tickInterval);
		stopwatchRep.value.timerState = TimerState.Running;
		lastIncrement = Date.now();
		tickInterval = setInterval(tryTick, TRY_TICK_INTERVAL);
	}

	/**
	 * Stops the timer.
	 */
	function stop() {
		clearInterval(tickInterval);
		stopwatchRep.value.timerState = TimerState.Stopped;
	}

	/**
	 * Stops and resets the timer, and clears the timer and results.
	 */
	function reset() {
		stop();
		TimeObject.setSeconds(stopwatchRep.value, 0);
		stopwatchRep.value.results = [];
	}

	/**
	 * Marks a runner as complete.
	 * @param data.index - The runner to modify.
	 * @param data.forfeit - Whether or not the runner forfeit.
	 */
	function completeRunner(data: {index: number; forfeit: boolean}) {
		if (!stopwatchRep.value.results[data.index]) {
			stopwatchRep.value.results[data.index] = new TimeObject(
				stopwatchRep.value.raw
			);
		}
		const result = stopwatchRep.value.results[data.index];
		if (result) {
			result.forfeit = data.forfeit;
			recalcPlaces();
		}
	}

	/**
	 * Marks a runner as still running.
	 * @param index - The runner to modify.
	 */
	function resumeRunner(index: number) {
		stopwatchRep.value.results[index] = null;
		recalcPlaces();
		if (stopwatchRep.value.timerState !== TimerState.Finished) {
			return;
		}
		const missedSeconds = Math.round(
			(Date.now() - stopwatchRep.value.timestamp) / 1000
		);
		TimeObject.setSeconds(
			stopwatchRep.value,
			stopwatchRep.value.raw + missedSeconds
		);
		start();
	}

	/**
	 * Edits the final time of a results.
	 * @param index - The runner to modify time of.
	 * @param newTime - A hh:mm:ss/mm:ss formatted new time.
	 */
	function editTime({
		index,
		newTime,
	}: {
		index: number | 'master';
		newTime: string;
	}) {
		if (!newTime) {
			return;
		}

		const newSeconds = TimeObject.parseSeconds(newTime);
		if (isNaN(newSeconds)) {
			return;
		}

		if (index === 'master') {
			TimeObject.setSeconds(stopwatchRep.value, newSeconds);
			return;
		}
		const result = stopwatchRep.value.results[index];
		if (!result) {
			return;
		}
		TimeObject.setSeconds(result, newSeconds);
		recalcPlaces();
		if (
			currentRunRep.value.runners &&
			currentRunRep.value.runners.length === 1
		) {
			TimeObject.setSeconds(stopwatchRep.value, newSeconds);
		}
	}

	/**
	 * Re-calculates the podium place for all runners.
	 */
	function recalcPlaces() {
		const finishedResults = stopwatchRep.value.results
			.filter(result => {
				if (result) {
					result.place = 0;
					return !result.forfeit;
				}
				return false;
			})
			.sort((a, b) => {
				if (!a) {
					return -1;
				}
				if (!b) {
					return 1;
				}
				return a.raw - b.raw;
			});
		finishedResults.forEach((r, index) => {
			if (!r) {
				return;
			}
			r.place = index + 1;
		});

		if (currentRunRep.value.runners === undefined) {
			return;
		}
		const allRunnersFinished = currentRunRep.value.runners.every(
			(_, index) => Boolean(stopwatchRep.value.results[index])
		);
		if (allRunnersFinished) {
			stop();
			stopwatchRep.value.timerState = TimerState.Finished;
		}
	}
};
