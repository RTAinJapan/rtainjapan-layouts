import streamDeck, {
	action,
	type KeyDownEvent,
	SingletonAction,
} from "@elgato/streamdeck";
import {nodecg} from "../nodecg/client";
import type {SendMessageSettings} from "../settings";

/**
 * Generic escape hatch: sends an arbitrary NodeCG message with JSON content,
 * so any bundle message can be assigned to a key without a dedicated action.
 */
@action({UUID: "jp.rtainjapan.layouts.send-message"})
export class SendMessage extends SingletonAction<SendMessageSettings> {
	override async onKeyDown(
		ev: KeyDownEvent<SendMessageSettings>,
	): Promise<void> {
		const messageName = ev.payload.settings.messageName?.trim();
		if (!messageName) {
			streamDeck.logger.warn("send-message: no message name configured");
			await ev.action.showAlert();
			return;
		}

		let content: unknown;
		const raw = ev.payload.settings.content?.trim();
		if (raw) {
			try {
				content = JSON.parse(raw);
			} catch {
				streamDeck.logger.error("send-message: content is not valid JSON");
				await ev.action.showAlert();
				return;
			}
		}

		try {
			await nodecg.dispatch(messageName, content);
			await ev.action.showOk();
		} catch (error) {
			streamDeck.logger.error(`send-message failed: ${String(error)}`);
			await ev.action.showAlert();
		}
	}
}
