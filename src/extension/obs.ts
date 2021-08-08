import {NodeCG} from "./nodecg";
import OBSWebSocket from "obs-websocket-js";
import {SceneItem} from "./obs-types/sceneItem";
import {Filter} from "./obs-types/filter";

export const obs = async (nodecg: NodeCG) => {
	const logger = new nodecg.Logger("obs");
	const obsConfig = nodecg.bundleConfig.obs;

	if (!obsConfig) {
		logger.warn("OBS config is empty.");
		return;
	}

	const obsRep = nodecg.Replicant("obs");
	const obsCropInputsRep = nodecg.Replicant("obs-crop-inputs");
	const obsRemoteInputsRep = nodecg.Replicant("obs-remote-inputs");

	const obs = new OBSWebSocket();

	const setRemoteSource = (input: string, index: number) => {
		if (!obsRemoteInputsRep.value?.[index]) {
			return;
		}

		obsRemoteInputsRep.value[index] = {
			input: input || null,
			viewId: "",
		};
	};

	const updateRemoteBrowser = (viewId: string, index: number) => {
		const remoteInputsValue = obsRemoteInputsRep.value;
		if (!remoteInputsValue) {
			return;
		}
		const remoteInput = remoteInputsValue[index];
		if (!remoteInput) {
			return;
		}

		const sourceName = remoteInput.input;
		if (sourceName === null) {
			return;
		}
		const viewUri = obsConfig.remoteViewUri.replace("{id}", viewId.trim());
		obs
			.send("SetSourceSettings", {
				sourceName,
				sourceSettings: {url: viewUri},
			})
			.then((_) => (remoteInput.viewId = viewId))
			.catch((_) =>
				logger.warn(
					`Error when update settings of the source "${sourceName}".`,
				),
			);
	};

	const updateSources = async () => {
		const obsCropInputs = obsCropInputsRep.value;
		if (!obsCropInputs) {
			return;
		}

		obs.send("GetSceneList").then((data) => {
			if (!obsRep.value) {
				return;
			}
			obsRep.value.scenes = data.scenes;
			const sources = data.scenes.flatMap((scene) => scene.sources);
			obsCropInputsRep.value = obsCropInputs.filter((cropInput) => {
				return sources.some((source) => {
					const sceneItem = source as any as SceneItem;
					return sceneItem.name === cropInput;
				});
			});

			return;
		});
	};

	const connect = async () => {
		const obsAddress = `${obsConfig.host}:${obsConfig.port || 4444}`;
		logger.info(`Connecting to ${obsAddress}`);

		try {
			await obs.connect({
				address: obsAddress,
				password: obsConfig.password,
			});
			logger.info("Connected to OBS.");

			updateSources();
		} catch (error) {
			logger.error(error);

			if (obsRep.value) {
				obsRep.value.connected = false;
			}
		}
	};

	const disconnect = () => {
		obs.disconnect();
		logger.info("Disconnected to OBS.");
	};

	const addCropInput = (id: string) => {
		if (
			!obsRep.value ||
			!obsRep.value.connected ||
			!obsCropInputsRep.value ||
			obsCropInputsRep.value.includes(id)
		) {
			return;
		}

		obsCropInputsRep.value.push(id);
	};

	const removeCropInput = (id: string) => {
		if (
			!obsRep.value ||
			!obsRep.value.connected ||
			!obsCropInputsRep.value ||
			!obsCropInputsRep.value.includes(id)
		) {
			return;
		}

		obsCropInputsRep.value = obsCropInputsRep.value.filter(
			(input) => input !== id,
		);
	};

	const resetCrop = async () => {
		if (
			!obsRep.value ||
			!obsRep.value.connected ||
			!obsRep.value.cropEnabled ||
			!obsCropInputsRep.value
		) {
			return;
		}
		const obsCropInputs = obsCropInputsRep.value;

		await updateSources();

		const resetPropertiesPromise = Promise.all(
			obsRep.value.scenes.map((scene) => {
				return scene.sources
					.filter((source) => obsCropInputs.includes(source.name))
					.map((source) => {
						return obs.send("SetSceneItemProperties", {
							"scene-name": scene.name,
							item: {id: source.id},
							crop: {
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
							},
							position: {},
							bounds: {},
							scale: {},
						});
					});
			}),
		);

		const resetFilterPromise = Promise.all(
			obsCropInputsRep.value.map((input) => {
				return obs
					.send("GetSourceFilters", {sourceName: input})
					.then((data) => {
						const filters = data.filters as Filter[];
						filters
							.filter((filter) => filter.type === "crop_filter")
							.map((filter) => {
								return obs.send("SetSourceFilterSettings", {
									sourceName: input,
									filterName: filter.name,
									filterSettings: {
										top: 0,
										bottom: 0,
										left: 0,
										right: 0,
									},
								});
							});
					});
			}),
		);

		Promise.all([resetPropertiesPromise, resetFilterPromise]).then(() => {
			logger.info("Reset crop of source items.");
		});
	};

	nodecg.listenFor("nextRun", (_, __) => {
		resetCrop();
	});

	nodecg.listenFor("obs:connect", (_, cb) => {
		connect();

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:disconnect", (_, cb) => {
		disconnect();

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:enableCrop", (_, cb) => {
		if (!obsRep.value || !obsRep.value.connected) {
			return;
		}

		obsRep.value.cropEnabled = true;
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:disableCrop", (_, cb) => {
		if (!obsRep.value || !obsRep.value.connected) {
			return;
		}

		obsRep.value.cropEnabled = false;
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:update", (_, cb) => {
		if (!obsRep.value || !obsRep.value.connected) {
			return;
		}

		updateSources();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:addCropInput", (data, cb) => {
		addCropInput(data);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:removeCropInput", (data, cb) => {
		removeCropInput(data);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:setRemoteSource", (data, cb) => {
		setRemoteSource(data.input, data.index);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("obs:updateRemoteBrowser", (data, cb) => {
		updateRemoteBrowser(data.viewId, data.index);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	// Events
	obs.on("ConnectionOpened", (_) => {
		if (!obsRep.value) {
			return;
		}
		obsRep.value.connected = true;
	});

	obs.on("ConnectionClosed", (_) => {
		if (!obsRep.value) {
			return;
		}
		obsRep.value.connected = false;
	});

	obs.on("SceneCollectionChanged", (_) => {
		updateSources();
	});

	logger.info("Connect to OBS automatically.");

	// Automatically connect to OBS for later operations
	await connect();
};
