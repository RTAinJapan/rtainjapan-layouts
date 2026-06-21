import {nodecg} from "../nodecg/client";
import {renderKey} from "./render";

/**
 * Builds the key image for a runner slot (used by the complete / resume /
 * display actions). The runner name is left-aligned and not truncated, so a
 * long name overflows past the right edge of the key.
 */
export function runnerKeyImage(index: number): string {
	const slot = `走者${index + 1}`;
	if (!nodecg.connected) {
		return renderKey({
			title: slot,
			subtitle: "オフライン",
			color: "offline",
			align: "start",
		});
	}
	const name = nodecg.runnerName(index);
	if (!name) {
		return renderKey({
			title: slot,
			subtitle: "空き",
			color: "empty",
			align: "start",
		});
	}
	const result = nodecg.timer?.results?.[index] ?? null;
	if (result) {
		return renderKey({
			title: name,
			subtitle: result.forfeit ? "リタイア" : result.formatted || "完走",
			color: result.forfeit ? "forfeit" : "finished",
			align: "start",
		});
	}
	const running = nodecg.timer?.timerState === "Running";
	return renderKey({
		title: name,
		subtitle: running ? "走行中" : "待機",
		color: running ? "running" : "idle",
		align: "start",
	});
}

/** Builds the key image for a master timer action (start / stop). */
export function masterKeyImage(label: string): string {
	if (!nodecg.connected) {
		return renderKey({title: label, subtitle: "オフライン", color: "offline"});
	}
	switch (nodecg.timer?.timerState) {
		case "Running":
			return renderKey({title: label, subtitle: "計測中", color: "running"});
		case "Finished":
			return renderKey({title: label, subtitle: "完了", color: "finished"});
		default:
			return renderKey({title: label, subtitle: "停止中", color: "idle"});
	}
}

/** Builds the key image for a fan-art queue action (start / stop). */
export function fanArtKeyImage(label: string): string {
	if (!nodecg.connected) {
		return renderKey({title: label, subtitle: "オフライン", color: "offline"});
	}
	return nodecg.tweetQueuePlaying
		? renderKey({title: label, subtitle: "表示中", color: "running"})
		: renderKey({title: label, subtitle: "停止中", color: "idle"});
}
