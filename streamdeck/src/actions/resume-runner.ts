import streamDeck, {
	action,
	type KeyAction,
	type KeyDownEvent,
} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {runnerKeyImage} from "../lib/key-state";
import {nodecg} from "../nodecg/client";
import type {RunnerSettings} from "../settings";

/** Marks a finished runner as still running again (再開). */
@action({UUID: "jp.rtainjapan.layouts.resume-runner"})
export class ResumeRunner extends RenderingAction {
	protected async imageFor(action: KeyAction): Promise<string> {
		const settings = await action.getSettings<RunnerSettings>();
		return runnerKeyImage(Number(settings.index) || 0);
	}

	override async onKeyDown(ev: KeyDownEvent<RunnerSettings>): Promise<void> {
		const index = Number(ev.payload.settings.index) || 0;
		try {
			// `resumeRunner` takes the raw index as its message content.
			await nodecg.dispatch("resumeRunner", index);
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`resumeRunner failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
