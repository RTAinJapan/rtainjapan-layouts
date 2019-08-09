import {increment, newTimer, parseSeconds, setSeconds} from '../nodecg/timer';
import {NodeCG} from './nodecg';

const TRY_TICK_INTERVAL = 10;

const getDefaultTimer = () => newTimer(0);

export const timekeeping = (nodecg: NodeCG) => {
	const checklistRep = nodecg.Replicant('checklist', {defaultValue: []});
	const currentRunRep = nodecg.Replicant('current-run', {defaultValue: null});
	const timerRep = nodecg.Replicant('timer', {
		defaultValue: getDefaultTimer(),
	});

	/**
	 * The UNIX time when the timer incremented last time
	 */
	let lastIncrement = 0;
	/**
	 * Keeps the timeout object
	 */
	let tickInterval: NodeJS.Timer;

	/**
	 * Increments the timer by one second if at least one second
	 * has passed since the last incerement.
	 * If it does, increament lastIncerement for 1000.
	 * Executing this function makes the timer very accurate to UNIX time,
	 * and can be easily extended to millisecond timer.
	 */
	const tryTick = () => {
		if (!timerRep.value) {
			return;
		}
		if (Date.now() - lastIncrement > 1000) {
			lastIncrement += 1000;
			increment(timerRep.value);
		}
	};

	/**
	 * Starts the timer.
	 * @param force - Forces the timer to start again, even if already running.
	 */
	const start = (force = false) => {
		if (!timerRep.value) {
			return;
		}
		// Don't start if checklist is not completed
		if (
			!checklistRep.value ||
			checklistRep.value.some((item) => !item.complete)
		) {
			return;
		}

		// Don't start the time if it's already running
		if (!force && timerRep.value.timerState === 'Running') {
			return;
		}

		clearInterval(tickInterval);
		timerRep.value.timerState = 'Running';
		lastIncrement = Date.now();
		tickInterval = setInterval(tryTick, TRY_TICK_INTERVAL);
	};

	/**
	 * Stops the timer.
	 */
	const stop = () => {
		if (!timerRep.value) {
			return;
		}
		clearInterval(tickInterval);
		timerRep.value.timerState = 'Stopped';
	};

	/**
	 * Stops and resets the timer, and clears the timer and results.
	 */
	const reset = () => {
		if (!timerRep.value) {
			return;
		}
		stop();
		setSeconds(timerRep.value, 0);
		timerRep.value.results = [];
	};

	/**
	 * Re-calculates the podium place for all runners.
	 */
	const recalcPlaces = () => {
		if (!timerRep.value || !currentRunRep.value) {
			return;
		}
		const finishedResults = timerRep.value.results
			.filter((result) => {
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
			(_, index) =>
				Boolean(timerRep.value && timerRep.value.results[index]),
		);
		if (allRunnersFinished) {
			stop();
			timerRep.value.timerState = 'Finished';
		}
	};

	/**
	 * Marks a runner as complete.
	 * @param data.index - The runner to modify.
	 * @param data.forfeit - Whether or not the runner forfeit.
	 */
	const completeRunner = (data: {index: number; forfeit: boolean}) => {
		if (!timerRep.value) {
			return;
		}
		if (!timerRep.value.results[data.index]) {
			timerRep.value.results[data.index] = newTimer(timerRep.value.raw);
		}
		const result = timerRep.value.results[data.index];
		if (result) {
			result.forfeit = data.forfeit;
			recalcPlaces();
		}
	};

	/**
	 * Marks a runner as still running.
	 * @param index - The runner to modify.
	 */
	const resumeRunner = (index: number) => {
		if (!timerRep.value) {
			return;
		}
		timerRep.value.results[index] = null;
		recalcPlaces();
		if (timerRep.value.timerState !== 'Finished') {
			return;
		}
		const missedSeconds = Math.round(
			(Date.now() - timerRep.value.timestamp) / 1000,
		);
		setSeconds(timerRep.value, timerRep.value.raw + missedSeconds);
		start();
	};

	/**
	 * Edits the final time of a results.
	 * @param index - The runner to modify time of.
	 * @param newTime - A hh:mm:ss/mm:ss formatted new time.
	 */
	const editTime = ({
		index,
		newTime,
	}: {
		index: number | 'master';
		newTime: string;
	}) => {
		if (!timerRep.value || !currentRunRep.value) {
			return;
		}
		if (!newTime) {
			return;
		}

		const newSeconds = parseSeconds(newTime);
		if (isNaN(newSeconds)) {
			return;
		}

		if (index === 'master') {
			setSeconds(timerRep.value, newSeconds);
			return;
		}
		const result = timerRep.value.results[index];
		if (!result) {
			return;
		}
		setSeconds(result, newSeconds);
		recalcPlaces();
		if (
			currentRunRep.value.runners &&
			currentRunRep.value.runners.length === 1
		) {
			setSeconds(timerRep.value, newSeconds);
		}
	};

	// If the timer was running when NodeCG was shut down last time,
	// resume the timer according to how long it has been since the shutdown time.
	if (timerRep.value && timerRep.value.timerState === 'Running') {
		const missedSeconds = Math.round(
			(Date.now() - timerRep.value.timestamp) / 1000,
		);
		setSeconds(timerRep.value, timerRep.value.raw + missedSeconds);
		start(true);
	}

	nodecg.listenFor('startTimer', start);
	nodecg.listenFor('stopTimer', stop);
	nodecg.listenFor('resetTimer', reset);
	nodecg.listenFor('completeRunner', completeRunner);
	nodecg.listenFor('resumeRunner', resumeRunner);
	nodecg.listenFor('editTime', editTime);
};
