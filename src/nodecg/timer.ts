import {Timer} from './replicants';

/**
 * Parses a number of seconds into an HMS object.
 * @param seconds A number of seconds.
 * @returns An HMS object.
 */
export const secondsToHMS = (seconds: number) => {
	return {
		h: Math.floor(seconds / 3600),
		m: Math.floor((seconds % 3600) / 60),
		s: Math.floor((seconds % 3600) % 60),
	};
};

/**
 * Formats an HMS object into a string ([hh:]mm:ss).
 * @param hms The HMS object to format.
 * @returns The formatted time string.
 */
export const formatHMS = (hms: {h: number; m: number; s: number}) => {
	let str = '';
	if (hms.h) {
		str += `${hms.h}:`;
	}

	str += `${hms.m < 10 ? `0${hms.m}` : hms.m}:${
		hms.s < 10 ? `0${hms.s}` : hms.s
	}`;
	return str;
};

/**
 * Parses a formatted time string into an integer of seconds.
 * @param timeString The formatted time string to parse (hh:mm:ss or mm:ss).
 * @returns The parsed time string represented as seconds.
 */
export const parseSeconds = (timeString: string) => {
	const timeParts = timeString.split(':').map(Number);
	if (timeParts.length === 3) {
		return (
			Math.floor(timeParts[0] * 3600) +
			Math.floor(timeParts[1] * 60) +
			Math.floor(timeParts[2])
		);
	}

	if (timeParts.length === 2) {
		return Math.floor(timeParts[0] * 60) + Math.floor(timeParts[1]);
	}

	if (timeParts.length === 1) {
		return Math.floor(timeParts[0]);
	}

	throw new Error(`Unexpected format of timeString argument: ${timeString}`);
};

/**
 * Increments a Timer by one second.
 * @param t - The Timer to increment.
 * @returns The Timer passed in as an argument.
 */
export const increment = (t: Timer) => {
	t.raw++;

	const hms = secondsToHMS(t.raw);
	t.hours = hms.h;
	t.minutes = hms.m;
	t.seconds = hms.s;
	t.formatted = formatHMS(hms);
	t.timestamp = Date.now();
	return t;
};

/**
 * Decrements a Timer by one second.
 * @param t The Timer to increment.
 * @returns The Timer passed in as an argument.
 */
export const decrement = (t: Timer) => {
	t.raw--;

	const hms = secondsToHMS(t.raw);
	t.hours = hms.h;
	t.minutes = hms.m;
	t.seconds = hms.s;
	t.formatted = formatHMS(hms);
	t.timestamp = Date.now();
	return t;
};

/**
 * Sets the value of a Timer.
 * @param t The Timer to set.
 * @param seconds The value to set to (in seconds).
 * @returns The Timer passed in as an argument.
 */
export const setSeconds = (t: Omit<Timer, 'results'>, seconds: number) => {
	const hms = secondsToHMS(seconds);
	t.hours = hms.h;
	t.minutes = hms.m;
	t.seconds = hms.s;
	t.formatted = formatHMS(hms);
	t.raw = seconds;
	t.timestamp = Date.now();
	return t;
};

/**
 * Formats a number of seconds into a string ([hh:]mm:ss).
 * @param seconds The number of seconds to format.
 * @returns The formatted time sting.
 */
export const formatSeconds = (seconds: number) => {
	const hms = secondsToHMS(seconds);
	return formatHMS(hms);
};

/**
 * Constructs a new Timer with the provided number of seconds.
 * @param seconds The value to instantiate this Timer with, in seconds.
 */
export const newTimer = (seconds = 0): Timer => {
	const hms = secondsToHMS(seconds);
	return {
		raw: seconds,
		hours: hms.h,
		minutes: hms.m,
		seconds: hms.s,
		formatted: formatHMS(hms),
		timestamp: Date.now(),
		timerState: 'Stopped',
		results: [null, null, null, null],
		forfeit: false,
	};
};
