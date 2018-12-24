export interface Runner {
	name: string;
	twitch?: string;
	nico?: string;
	twitter?: string;
}

export interface Run {
	pk: number;
	index: number;
	scheduled: number;
	title: string;
	engTitle?: string;
	category: string;
	platform: string;
	duration: string;
	runners: Runner[];
	commentators: Runner[];
}

export const enum TimerState {
	Stopped = 'Stopped',
	Running = 'Running',
	Finished = 'Finished',
}
