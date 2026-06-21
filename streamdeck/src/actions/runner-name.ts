import {action, type KeyAction} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {runnerKeyImage} from "../lib/key-state";
import type {RunnerSettings} from "../settings";

/**
 * Display-only key: shows the configured runner's name (with status and colour)
 * from the current-run replicant. Pressing the key performs no timer action.
 */
@action({UUID: "jp.rtainjapan.layouts.runner-name"})
export class RunnerName extends RenderingAction {
	protected async imageFor(action: KeyAction): Promise<string> {
		const settings = await action.getSettings<RunnerSettings>();
		return runnerKeyImage(Number(settings.index) || 0);
	}
}
