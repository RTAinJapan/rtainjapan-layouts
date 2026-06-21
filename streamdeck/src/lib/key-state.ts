import {nodecg} from "../nodecg/client";
import {renderActionKey, renderKey} from "./render";

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
