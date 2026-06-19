import type {NodeCgConfig} from "./nodecg/client";

/** Plugin-wide connection settings, persisted as Stream Deck global settings. */
export type GlobalSettings = {
	url?: string;
	bundleName?: string;
	key?: string;
};

/** Settings for the runner-targeted actions (complete / resume). */
export type RunnerSettings = {
	/** Runner slot, 0-3. */
	index?: number;
	/** Whether "complete" marks the runner as forfeited. */
	forfeit?: boolean;
};

/** Settings for the generic message action. */
export type SendMessageSettings = {
	messageName?: string;
	/** JSON-encoded message content. */
	content?: string;
};

export const DEFAULT_URL = "http://localhost:9090";
export const DEFAULT_BUNDLE = "rtainjapan-layouts";

/** Resolves persisted global settings into a usable connection config. */
export function toNodeCgConfig(settings: GlobalSettings): NodeCgConfig {
	return {
		url: settings.url?.trim() || DEFAULT_URL,
		bundleName: settings.bundleName?.trim() || DEFAULT_BUNDLE,
		key: settings.key?.trim() || undefined,
	};
}
