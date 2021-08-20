import OBSWebSocket from "obs-websocket-js";

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
			await obs.connect(obsConfig);
			await obs.send("SetHeartbeat", {enable: true});
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
			await obs.send("StartRecording");
			logger.info("Started recording");
		} catch (error: unknown) {
			logger.error("Failed to start recording:", error);
		}
	};
	const stopRecording = async () => {
		try {
			await obs.send("StopRecording");
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
		obsStatus.value = {
			connected: true,
			record: false,
			stream: false,
			streamTime: 0,
			recordTime: 0,
		};
	});
	obs.on("Heartbeat", (data) => {
		obsStatus.value = {
			connected: true,
			record: data.recording ?? false,
			stream: data.streaming ?? false,
			streamTime: data["total-stream-time"] ?? 0,
			recordTime: data["total-record-time"] ?? 0,
		};
		if (!data.recording) {
			void startRecording();
		}
	});
	obs.on("ConnectionClosed", () => {
		if (obsStatus.value?.connected) {
			logger.info(`Disconnected`);
			obsStatus.value = {
				connected: false,
				record: false,
				stream: false,
				streamTime: 0,
				recordTime: 0,
			};
		}
	});

	void connect();

	setInterval(() => {
		if (!obsStatus.value?.connected) {
			void connect(false);
		}
	}, 1000);
};
