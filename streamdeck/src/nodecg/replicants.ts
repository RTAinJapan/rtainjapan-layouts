// Minimal local mirrors of the NodeCG replicant shapes this plugin reads.
// The source of truth lives in the main project's JSON schemas:
//   - schemas/timer.json
//   - schemas/lib/run.json (referenced by schemas/current-run.json)
// Only the fields the plugin actually consumes are modelled here so the
// Stream Deck build stays self-contained (the generated types under
// src/nodecg/generated are gitignored and produced by `npm run schema-types`).

export type TimerState = "Finished" | "Running" | "Stopped";

export type TimerResult = {
	raw: number;
	formatted: string;
	timerState: TimerState;
	forfeit: boolean;
	place?: number;
};

export type Timer = {
	raw: number;
	formatted: string;
	timerState: TimerState;
	results: (TimerResult | null)[];
};

export type Runner = {
	name: string;
};

export type CurrentRun = {
	runners: Runner[];
};
