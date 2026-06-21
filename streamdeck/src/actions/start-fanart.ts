import streamDeck, {action, type KeyDownEvent} from "@elgato/streamdeck";
import {RenderingAction} from "./base";
import {fanArtKeyImage} from "../lib/key-state";
import {nodecg} from "../nodecg/client";

/** Starts the fan-art ("まとめて表示") queue. */
@action({UUID: "jp.rtainjapan.layouts.start-fanart"})
export class StartFanArt extends RenderingAction {
	protected imageFor(): string {
		return fanArtKeyImage("表示開始");
	}

	override async onKeyDown(ev: KeyDownEvent): Promise<void> {
		try {
			await nodecg.dispatch("startTweetQueue");
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`startTweetQueue failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
