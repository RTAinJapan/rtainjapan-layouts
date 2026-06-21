import streamDeck, {
	action,
	type KeyAction,
	type KeyDownEvent,
} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {runnerActionKeyImage} from "../lib/key-state";
import {nodecg} from "../nodecg/client";
import type {RunnerSettings} from "../settings";

/** Marks a runner as forfeited (リタイア). */
@action({UUID: "jp.rtainjapan.layouts.forfeit-runner"})
export class ForfeitRunner extends RenderingAction {
	protected async imageFor(action: KeyAction): Promise<string> {
		const settings = await action.getSettings<RunnerSettings>();
		return runnerActionKeyImage(Number(settings.index) || 0, "リタイア");
	}

	override async onKeyDown(ev: KeyDownEvent<RunnerSettings>): Promise<void> {
		const index = Number(ev.payload.settings.index) || 0;
		try {
			await nodecg.dispatch("completeRunner", {index, forfeit: true});
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(
				`completeRunner (forfeit) failed: ${String(error)}`,
			);
			await ev.action.showAlert();
		}
	}
}
