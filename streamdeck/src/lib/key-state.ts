import {nodecg} from "../nodecg/client";
import {renderActionKey, renderKey, type KeyColor} from "./render";

/** Resolves a runner slot's display name, status text and colour. */
function runnerVisual(index: number): {
	target: string;
	state: string;
	color: KeyColor;
} {
	const slot = `走者${index + 1}`;
	if (!nodecg.connected) {
		return {target: slot, state: "オフライン", color: "offline"};
	}
	const name = nodecg.runnerName(index);
	if (!name) {
		return {target: slot, state: "空き", color: "empty"};
	}
	const result = nodecg.timer?.results?.[index] ?? null;
	if (result) {
		return {
			target: name,
			state: result.forfeit ? "リタイア" : result.formatted || "完走",
			color: result.forfeit ? "forfeit" : "finished",
		};
	}
	const running = nodecg.timer?.timerState === "Running";
	return {
		target: name,
		state: running ? "走行中" : "待機",
		color: running ? "running" : "idle",
	};
}

/**
 * Builds the 2-line key image for the runner-name display action (name +
 * status). The runner name is left-aligned and not truncated, so a long name
 * overflows past the right edge of the key.
 */
export function runnerKeyImage(index: number): string {
	const {target, state, color} = runnerVisual(index);
	return renderKey({title: target, subtitle: state, color, align: "start"});
}

/**
 * Builds the 3-line key image for a runner action (完走 / リタイア / 再開),
 * shown as "{走者名} / {状態} / {アクション}" with the name left-aligned.
 */
export function runnerActionKeyImage(index: number, action: string): string {
	const {target, state, color} = runnerVisual(index);
	return renderActionKey({target, state, action, color, align: "start"});
}

/**
 * Builds the key image for a master timer action (start / stop), shown as
 * "タイマー / {状態} / {アクション}".
 */
export function masterKeyImage(action: string): string {
	const target = "タイマー";
	if (!nodecg.connected) {
		return renderActionKey({
			target,
			state: "オフライン",
			action,
			color: "offline",
		});
	}
	switch (nodecg.timer?.timerState) {
		case "Running":
			return renderActionKey({
				target,
				state: "計測中",
				action,
				color: "running",
			});
		case "Finished":
			return renderActionKey({
				target,
				state: "完了",
				action,
				color: "finished",
			});
		default:
			return renderActionKey({target, state: "停止中", action, color: "idle"});
	}
}

/**
 * Builds the key image for a fan-art queue action (start / stop), shown as
 * "ファンアート / {状態} / {アクション}".
 */
export function fanArtKeyImage(action: string): string {
	const target = "ファンアート";
	if (!nodecg.connected) {
		return renderActionKey({
			target,
			state: "オフライン",
			action,
			color: "offline",
		});
	}
	return nodecg.tweetQueuePlaying
		? renderActionKey({target, state: "表示中", action, color: "running"})
		: renderActionKey({target, state: "停止中", action, color: "idle"});
}
