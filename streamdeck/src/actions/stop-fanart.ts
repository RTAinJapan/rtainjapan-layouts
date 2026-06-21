import streamDeck, {action, type KeyDownEvent} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {fanArtKeyImage} from "../lib/key-state";
import {nodecg} from "../nodecg/client";

/** Stops the fan-art ("まとめて表示") queue. */
@action({UUID: "jp.rtainjapan.layouts.stop-fanart"})
export class StopFanArt extends RenderingAction {
	protected imageFor(): string {
		return fanArtKeyImage("表示停止");
	}

	override async onKeyDown(ev: KeyDownEvent): Promise<void> {
		try {
			await nodecg.dispatch("stopTweetQueue");
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`stopTweetQueue failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
