import streamDeck, {
	action,
	type KeyAction,
	type KeyDownEvent,
} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {runnerKeyImage} from "../lib/key-state";
import {nodecg} from "../nodecg/client";
import type {RunnerSettings} from "../settings";

/**
 * Marks a runner as complete. With `forfeit` enabled the key acts as a
 * "リタイア" (forfeit) button; otherwise it is a "完走" (finish) button.
 */
@action({UUID: "jp.rtainjapan.layouts.complete-runner"})
export class CompleteRunner extends RenderingAction {
	protected async imageFor(action: KeyAction): Promise<string> {
		const settings = await action.getSettings<RunnerSettings>();
		return runnerKeyImage(Number(settings.index) || 0);
	}

	override async onKeyDown(ev: KeyDownEvent<RunnerSettings>): Promise<void> {
		const index = Number(ev.payload.settings.index) || 0;
		const forfeit =
			ev.payload.settings.forfeit === true ||
			(ev.payload.settings.forfeit as unknown) === "true";
		try {
			await nodecg.dispatch("completeRunner", {index, forfeit});
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`completeRunner failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
