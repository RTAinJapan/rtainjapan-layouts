import streamDeck from "@elgato/streamdeck";
import {CompleteRunner} from "./actions/complete-runner";
import {Reload} from "./actions/reload";
import {ResumeRunner} from "./actions/resume-runner";
import {RunnerName} from "./actions/runner-name";
import {SendMessage} from "./actions/send-message";
import {StartFanArt} from "./actions/start-fanart";
import {StartTimer} from "./actions/start-timer";
import {StopFanArt} from "./actions/stop-fanart";
import {StopTimer} from "./actions/stop-timer";
import {nodecg} from "./nodecg/client";
import {toNodeCgConfig, type GlobalSettings} from "./settings";

streamDeck.actions.registerAction(new StartTimer());
streamDeck.actions.registerAction(new StopTimer());
streamDeck.actions.registerAction(new StartFanArt());
streamDeck.actions.registerAction(new StopFanArt());
streamDeck.actions.registerAction(new CompleteRunner());
streamDeck.actions.registerAction(new ResumeRunner());
streamDeck.actions.registerAction(new RunnerName());
streamDeck.actions.registerAction(new Reload());
streamDeck.actions.registerAction(new SendMessage());

// Reconnect whenever the connection settings are changed from any property
// inspector.
streamDeck.settings.onDidReceiveGlobalSettings<GlobalSettings>((ev) => {
	nodecg.configure(toNodeCgConfig(ev.settings));
});

streamDeck
	.connect()
	.then(() => streamDeck.settings.getGlobalSettings<GlobalSettings>())
	.then((settings) => {
		nodecg.configure(toNodeCgConfig(settings));
	})
	.catch((error: unknown) => {
		streamDeck.logger.error(`Failed to start plugin: ${String(error)}`);
	});
