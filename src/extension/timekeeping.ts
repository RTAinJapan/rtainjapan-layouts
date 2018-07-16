import {TimeObject, TimerState} from './classes/time-object';
import {NodeCG} from '../types/nodecg';
import {CurrentRun} from '../types/schemas/currentRun';
import {ChecklistCompleted} from '../types/schemas/checklistCompleted';

const TRY_TICK_INTERVAL = 10;

const defaultStopwatch = () => new TimeObject(0);

export const timekeeping = (nodecg: NodeCG) => {
	const checklistComplete = nodecg.Replicant<ChecklistCompleted>(
		'checklistComplete'
	);
	const currentRun = nodecg.Replicant<CurrentRun>('currentRun');
	const stopwatch = nodecg.Replicant<TimeObject>('stopwatch', {
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
	if (stopwatch.value.timerState === TimerState.Running) {
		const missedSeconds = Math.round(
			(Date.now() - stopwatch.value.timestamp) / 1000
		);
		TimeObject.setSeconds(
			stopwatch.value,
			stopwatch.value.raw + missedSeconds
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
			TimeObject.increment(stopwatch.value);
		}
	}

	/**
	 * Starts the timer.
	 * @param force - Forces the timer to start again, even if already running.
	 */
	function start(force: boolean = false) {
		if (!checklistComplete) {
			return;
		}

		if (!force && stopwatch.value.timerState === TimerState.Running) {
			return;
		}

		clearInterval(tickInterval);
		stopwatch.value.timerState = TimerState.Running;
		lastIncrement = Date.now();
		tickInterval = setInterval(tryTick, TRY_TICK_INTERVAL);
	}

	/**
	 * Stops the timer.
	 */
	function stop() {
		clearInterval(tickInterval);
		stopwatch.value.timerState = TimerState.Stopped;
	}

	/**
	 * Stops and resets the timer, and clears the timer and results.
	 */
	function reset() {
		stop();
		TimeObject.setSeconds(stopwatch.value, 0);
		stopwatch.value.results = [];
	}

	/**
	 * Marks a runner as complete.
	 * @param data.index - The runner to modify.
	 * @param data.forfeit - Whether or not the runner forfeit.
	 */
	function completeRunner(data: {index: number; forfeit: boolean}) {
		if (!stopwatch.value.results[data.index]) {
			stopwatch.value.results[data.index] = new TimeObject(
				stopwatch.value.raw
			);
		}
		const result = stopwatch.value.results[data.index];
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
		stopwatch.value.results[index] = null;
		recalcPlaces();
		if (stopwatch.value.timerState !== TimerState.Finished) {
			return;
		}
		const missedSeconds = Math.round(
			(Date.now() - stopwatch.value.timestamp) / 1000
		);
		TimeObject.setSeconds(
			stopwatch.value,
			stopwatch.value.raw + missedSeconds
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
			TimeObject.setSeconds(stopwatch.value, newSeconds);
			return;
		}
		const result = stopwatch.value.results[index];
		if (!result) {
			return;
		}
		TimeObject.setSeconds(result, newSeconds);
		recalcPlaces();
		if (currentRun.value.runners && currentRun.value.runners.length === 1) {
			TimeObject.setSeconds(stopwatch.value, newSeconds);
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

		if (currentRun.value.runners === undefined) {
			return;
		}
		const allRunnersFinished = currentRun.value.runners.every((_, index) =>
			Boolean(stopwatch.value.results[index])
		);
		if (allRunnersFinished) {
			stop();
			stopwatch.value.timerState = TimerState.Finished;
		}
	}
};
