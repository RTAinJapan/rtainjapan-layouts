import streamDeck, {action, type KeyDownEvent} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {masterKeyImage} from "../lib/key-state";
import {nodecg} from "../nodecg/client";

/** Stops (pauses) the master timer. */
@action({UUID: "jp.rtainjapan.layouts.stop-timer"})
export class StopTimer extends RenderingAction {
	protected imageFor(): string {
		return masterKeyImage("停止");
	}

	override async onKeyDown(ev: KeyDownEvent): Promise<void> {
		try {
			await nodecg.dispatch("stopTimer");
		} catch (error) {
			streamDeck.logger.error(`stopTimer failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
