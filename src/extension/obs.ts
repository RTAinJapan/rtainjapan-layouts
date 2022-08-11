import OBSWebSocket, {EventSubscription} from "obs-websocket-js";

import type {NodeCG} from "./nodecg";

const obs = new OBSWebSocket();

export const setupObs = (nodecg: NodeCG) => {
	const {obs: obsConfig} = nodecg.bundleConfig;
	const logger = new nodecg.Logger("obs");
	const obsStatus = nodecg.Replicant("obs-status");

	if (!obsConfig) {
		logger.warn("OBS setting is empty");
		return;
	}

	let attemptingToConnect = false;
	const connect = async (emitError = true) => {
		if (attemptingToConnect) {
			return;
		}
		attemptingToConnect = true;
		try {
			await obs.connect(obsConfig.address, obsConfig.password, {
				eventSubscriptions: EventSubscription.Outputs,
			});
		} catch (error: unknown) {
			if (emitError) {
				logger.error("Failed to connect:", error);
			}
		} finally {
			attemptingToConnect = false;
		}
	};
	const startRecording = async () => {
		try {
			await obs.call("StartRecord");
			logger.info("Started recording");
		} catch (error: unknown) {
			logger.error("Failed to start recording:", error);
		}
	};
	const stopRecording = async () => {
		try {
			await obs.call("StopRecord");
			logger.info("Stopped recording");
		} catch (error: unknown) {
			logger.error("Failed to stop recording:", error);
		}
	};

	nodecg.listenFor("nextRun", () => {
		void stopRecording();
	});

	obs.on("ConnectionOpened", () => {
		logger.info(`Connected: ${obsConfig.address}`);
	});
	obs.on("Identified", async () => {
		const {outputActive} = await obs.call("GetRecordStatus");
		if (!outputActive) {
			await startRecording();
		}
	});
	obs.on("RecordStateChanged", (data) => {
		if (data.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPED") {
			void startRecording();
		}
	});
	obs.on("ConnectionClosed", () => {
		if (obsStatus.value?.connected) {
			logger.info(`Disconnected`);
		}
	});

	void connect();

	setInterval(() => {
		if (!obsStatus.value?.connected) {
			void connect(false);
		}
	}, 1000);
};
