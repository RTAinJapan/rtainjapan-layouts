import OBSWebSocket, {EventSubscription} from "obs-websocket-js";

import type {NodeCG} from "./nodecg";

const obs = new OBSWebSocket();

export const setupObs = (nodecg: NodeCG) => {
	const {obs: obsConfig} = nodecg.bundleConfig;
	const logger = new nodecg.Logger("obs");
	const currentSceneRep = nodecg.Replicant("obs-current-scene");

	if (!obsConfig) {
		logger.warn("OBS setting is empty");
		return;
	}

	// 自動録画 (接続時に録画開始 / 録画停止時に再開 / nextRun で停止) を使うか。
	// 既定はオフ。使う場合は config の obs.autoRecord を true にする。
	const autoRecord = obsConfig.autoRecord ?? false;

	let connected = false;
	let attemptingToConnect = false;
	const connect = async (emitError = true) => {
		if (attemptingToConnect || connected) {
			return;
		}
		attemptingToConnect = true;
		try {
			await obs.connect(obsConfig.address, obsConfig.password, {
				eventSubscriptions:
					EventSubscription.Outputs | EventSubscription.Scenes,
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
		if (autoRecord) {
			void stopRecording();
		}
	});

	obs.on("ConnectionOpened", () => {
		logger.info(`Connected: ${obsConfig.address}`);
	});
	obs.on("Identified", async () => {
		connected = true;
		if (autoRecord) {
			const {outputActive} = await obs.call("GetRecordStatus");
			if (!outputActive) {
				await startRecording();
			}
		}
		try {
			const {sceneName} = await obs.call("GetCurrentProgramScene");
			currentSceneRep.value = sceneName;
		} catch (error: unknown) {
			logger.error("Failed to get current program scene:", error);
		}
	});
	obs.on("CurrentProgramSceneChanged", (data) => {
		currentSceneRep.value = data.sceneName;
	});
	obs.on("RecordStateChanged", (data) => {
		if (autoRecord && data.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPED") {
			void startRecording();
		}
	});
	obs.on("ConnectionClosed", () => {
		if (connected) {
			logger.info(`Disconnected`);
		}
		connected = false;
		// 切断中はプログラムシーンが不明なので空にする (Setup と誤判定しないため)。
		currentSceneRep.value = "";
	});

	void connect();

	// 接続が切れているときだけ再接続を試みる。
	// (接続済みなのに再接続するとシーン追跡が不安定になり、ログも溢れる)
	setInterval(() => {
		if (!connected) {
			void connect(false);
		}
	}, 1000);
};
