import {
	type KeyAction,
	SingletonAction,
	type WillAppearEvent,
} from "@elgato/streamdeck";
import {nodecg} from "../nodecg/client";

/**
 * Base class for actions whose key image reflects live NodeCG state. Subclasses
 * provide {@link imageFor}; the base re-renders every visible instance whenever
 * the observed replicants or the connection status change.
 */
export abstract class RenderingAction extends SingletonAction {
	constructor() {
		super();
		nodecg.on("change", () => void this.renderAll());
		nodecg.on("status", () => void this.renderAll());
	}

	override onWillAppear(ev: WillAppearEvent): Promise<void> | void {
		if (ev.action.isKey()) {
			return this.render(ev.action);
		}
	}

	protected async renderAll(): Promise<void> {
		for (const action of this.actions) {
			if (action.isKey()) {
				await this.render(action);
			}
		}
	}

	protected async render(action: KeyAction): Promise<void> {
		await action.setImage(await this.imageFor(action));
	}

	/** Returns the key image (data URI) for the given action instance. */
	protected abstract imageFor(action: KeyAction): Promise<string> | string;
}
