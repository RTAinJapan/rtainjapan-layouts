import streamDeck, {action, type KeyDownEvent} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {masterKeyImage} from "../lib/key-state";
import {nodecg} from "../nodecg/client";

/** Starts (or resumes) the master timer. */
@action({UUID: "jp.rtainjapan.layouts.start-timer"})
export class StartTimer extends RenderingAction {
	protected imageFor(): string {
		return masterKeyImage("開始");
	}

	override async onKeyDown(ev: KeyDownEvent): Promise<void> {
		try {
			await nodecg.dispatch("startTimer", undefined);
		} catch (error) {
			streamDeck.logger.error(`startTimer failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
