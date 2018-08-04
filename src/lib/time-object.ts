export const enum TimerState {
	Stopped,
	Running,
	Finished,
}

/**
 * TimeObject class.
 */
export class TimeObject {

	/**
	 * Increments a TimeObject by one second.
	 * @param t - The TimeObject to increment.
	 * @returns The TimeObject passed in as an argument.
	 */
	public static increment(t: TimeObject) {
		t.raw++;

		const hms = TimeObject.secondsToHMS(t.raw);
		t.hours = hms.h;
		t.minutes = hms.m;
		t.seconds = hms.s;
		t.formatted = TimeObject.formatHMS(hms);
		t.timestamp = Date.now();
		return t;
	}

	/**
	 * Decrements a TimeObject by one second.
	 * @param t The TimeObject to increment.
	 * @returns The TimeObject passed in as an argument.
	 */
	public static decrement(t: TimeObject) {
		t.raw--;

		const hms = TimeObject.secondsToHMS(t.raw);
		t.hours = hms.h;
		t.minutes = hms.m;
		t.seconds = hms.s;
		t.formatted = TimeObject.formatHMS(hms);
		t.timestamp = Date.now();
		return t;
	}

	/**
	 * Sets the value of a TimeObject.
	 * @param t The TimeObject to set.
	 * @param seconds The value to set to (in seconds).
	 * @returns The TimeObject passed in as an argument.
	 */
	public static setSeconds(t: TimeObject, seconds: number) {
		const hms = TimeObject.secondsToHMS(seconds);
		t.hours = hms.h;
		t.minutes = hms.m;
		t.seconds = hms.s;
		t.formatted = TimeObject.formatHMS(hms);
		t.raw = seconds;
		t.timestamp = Date.now();
		return t;
	}

	/**
	 * Formats an HMS object into a string ([hh:]mm:ss).
	 * @param hms The HMS object to format.
	 * @returns The formatted time string.
	 */
	public static formatHMS(hms: {h: number; m: number; s: number}) {
		let str = '';
		if (hms.h) {
			str += `${hms.h}:`;
		}

		str += `${hms.m < 10 ? `0${hms.m}` : hms.m}:${
			hms.s < 10 ? `0${hms.s}` : hms.s
		}`;
		return str;
	}

	/**
	 * Formats a number of seconds into a string ([hh:]mm:ss).
	 * @param seconds The number of seconds to format.
	 * @returns The formatted time sting.
	 */
	public static formatSeconds(seconds: number) {
		const hms = TimeObject.secondsToHMS(seconds);
		return TimeObject.formatHMS(hms);
	}

	/**
	 * Parses a number of seconds into an HMS object.
	 * @param seconds A number of seconds.
	 * @returns An HMS object.
	 */
	public static secondsToHMS(seconds: number) {
		return {
			h: Math.floor(seconds / 3600),
			m: Math.floor((seconds % 3600) / 60),
			s: Math.floor((seconds % 3600) % 60),
		};
	}

	/**
	 * Parses a formatted time string into an integer of seconds.
	 * @param timeString The formatted time string to parse (hh:mm:ss or mm:ss).
	 * @returns The parsed time string represented as seconds.
	 */
	public static parseSeconds(timeString: string) {
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

		throw new Error(
			`Unexpected format of timeString argument: ${timeString}`
		);
	}
	public raw: number;
	public hours: number;
	public minutes: number;
	public seconds: number;
	public formatted: string;
	public timestamp: number = Date.now();
	public timerState: TimerState = TimerState.Stopped;
	public results: Array<TimeObject | null> = [null, null, null, null];
	public forfeit: boolean = false;
	public place?: number;

	/**
	 * Constructs a new TimeObject with the provided number of seconds.
	 * @param seconds The value to instantiate this TimeObject with, in seconds.
	 */
	constructor(seconds = 0) {
		this.raw = seconds;

		const hms = TimeObject.secondsToHMS(seconds);
		this.hours = hms.h;
		this.minutes = hms.m;
		this.seconds = hms.s;
		this.formatted = TimeObject.formatHMS(hms);
	}
}
