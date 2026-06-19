import streamDeck, {action, type KeyDownEvent} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {renderKey} from "../lib/render";
import {nodecg} from "../nodecg/client";

/** Re-synchronises the replicant observer (fallback for missed events). */
@action({UUID: "jp.rtainjapan.layouts.reload"})
export class Reload extends RenderingAction {
	protected imageFor(): string {
		return renderKey({
			title: "再同期",
			subtitle: nodecg.connected ? "接続中" : "未接続",
			color: nodecg.connected ? "idle" : "offline",
		});
	}

	override async onKeyDown(ev: KeyDownEvent): Promise<void> {
		try {
			await nodecg.reload();
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`reload failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
