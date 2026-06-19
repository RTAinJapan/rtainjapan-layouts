import {nodecg} from "../nodecg/client";
import {renderKey} from "./render";

/** Builds the key image for a runner-targeted action (complete / resume). */
export function runnerKeyImage(index: number): string {
	const slot = `走者${index + 1}`;
	if (!nodecg.connected) {
		return renderKey({title: slot, subtitle: "オフライン", color: "offline"});
	}
	const name = nodecg.runnerName(index);
	if (!name) {
		return renderKey({title: slot, subtitle: "空き", color: "empty"});
	}
	const result = nodecg.timer?.results?.[index] ?? null;
	if (result) {
		return result.forfeit
			? renderKey({title: name, subtitle: "リタイア", color: "forfeit"})
			: renderKey({
					title: name,
					subtitle: result.formatted || "完走",
					color: "finished",
			  });
	}
	const running = nodecg.timer?.timerState === "Running";
	return renderKey({
		title: name,
		subtitle: running ? "走行中" : "待機",
		color: running ? "running" : "idle",
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
