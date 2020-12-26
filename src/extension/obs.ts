import {NodeCG} from './nodecg';
import OBSWebSocket from 'obs-websocket-js';
import {SceneItem} from './obs-types/sceneItem';
import {Filter} from './obs-types/filter';

export const obs = (nodecg: NodeCG) => {
	const logger = new nodecg.Logger('obs');
	const obsConfig = nodecg.bundleConfig.obs;
	if (!obsConfig) {
		logger.warn('OBS config is empty.');
		return;
	}

	const obsRep = nodecg.Replicant('obs', {
		defaultValue: {
			connected: false,
			cropEnabled: false,
			scenes: [],
		},
	});
	const obsCropInputsRep = nodecg.Replicant('obs-crop-inputs', {
		defaultValue: [],
	});
	const obsRemoteInputsRep = nodecg.Replicant('obs-remote-inputs', {
		defaultValue: [
			{input: null, viewId: ''},
			{input: null, viewId: ''},
			{input: null, viewId: ''},
			{input: null, viewId: ''},
		],
	});

	const obs = new OBSWebSocket();

	const setRemoteSource = (input: string, index: number) => {
		if (
			!obsRemoteInputsRep.value ||
			!(index in obsRemoteInputsRep.value) ||
			index < 0 ||
			index > 3
		) {
			return;
		}

		obsRemoteInputsRep.value[index] = {
			input: input || null,
			viewId: '',
		};
	};

	const updateRemoteBrowser = (viewId: string, index: number) => {
		if (!obsRemoteInputsRep.value || !(index in obsRemoteInputsRep.value)) {
			return;
		}

		const sourceName = obsRemoteInputsRep.value[index].input;
		if (sourceName === null) {
			return;
		}
		const viewUri = obsConfig.remoteViewUri.replace('{id}', viewId.trim());
		obs
			.send('SetSourceSettings', {
				sourceName,
				sourceSettings: {url: viewUri},
			})
			.then((_) => (obsRemoteInputsRep.value[index].viewId = viewId))
			.catch((_) =>
				logger.warn(
					`Error when update settings of the source "${sourceName}".`,
				),
			);
	};

	const updateSources = async () => {
		if (!obsRep.value || !obsCropInputsRep.value) {
			return;
		}

		obs.send('GetSceneList').then((data) => {
			obsRep.value.scenes = data.scenes;
			const sources = data.scenes.flatMap((scene) => scene.sources);
			obsCropInputsRep.value = obsCropInputsRep.value.filter((cropInput) => {
				return sources.some((source) => {
					const sceneItem = (source as any) as SceneItem;
					return sceneItem.name === cropInput;
				});
			});

			return;
		});
	};

	const connect = () => {
		const options = {
			host: obsConfig.host,
			port: obsConfig.port || 4444,
			password: obsConfig.password,
		};

		logger.info('Connecting to:', options);

		obs
			.connect(options)
			.then(() => {
				logger.info('Connected to OBS.');

				updateSources();
			})
			.catch((err) => {
				logger.error(err.error);

				if (!obsRep.value) {
					return;
				}

				obsRep.value.connected = false;
			});
	};

	const disconnect = () => {
		obs.disconnect();
		logger.info('Disconnected to OBS.');
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

		await updateSources();

		const resetPropertiesPromise = Promise.all(
			obsRep.value.scenes.map((scene) => {
				return obsCropInputsRep.value.map((input) => {
					if (!scene.sources.some((source) => source.name === input)) {
						return;
					}
					return obs.send('SetSceneItemProperties', {
						'scene-name': scene.name,
						item: {name: input},
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
					.send('GetSourceFilters', {sourceName: input})
					.then((data) => {
						const filters = data.filters as Filter[];
						filters
							.filter((filter) => filter.type === 'crop_filter')
							.map((filter) => {
								return obs.send('SetSourceFilterSettings', {
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
			logger.info('Reset crop of source items.');
		});
	};

	nodecg.listenFor('nextRun', (_, __) => {
		resetCrop();
	});

	nodecg.listenFor('obs:connect', (_, cb) => {
		connect();

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:disconnect', (_, cb) => {
		disconnect();

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:enableCrop', (_, cb) => {
		if (!obsRep.value || !obsRep.value.connected) {
			return;
		}

		obsRep.value.cropEnabled = true;
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:disableCrop', (_, cb) => {
		if (!obsRep.value || !obsRep.value.connected) {
			return;
		}

		obsRep.value.cropEnabled = false;
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:update', (_, cb) => {
		if (!obsRep.value || !obsRep.value.connected) {
			return;
		}

		updateSources();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:addCropInput', (data, cb) => {
		addCropInput(data);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:removeCropInput', (data, cb) => {
		removeCropInput(data);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:setRemoteSource', (data, cb) => {
		setRemoteSource(data.input, data.index);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('obs:updateRemoteBrowser', (data, cb) => {
		updateRemoteBrowser(data.viewId, data.index);

		if (cb && !cb.handled) {
			cb(null);
		}
	});

	// Events
	obs.on('ConnectionOpened', (_) => {
		if (!obsRep.value) {
			return;
		}
		obsRep.value.connected = true;
	});

	obs.on('ConnectionClosed', (_) => {
		if (!obsRep.value) {
			return;
		}
		obsRep.value.connected = false;
	});

	obs.on('SceneCollectionChanged', (_) => {
		updateSources();
	});

	if (obsRep.value && obsRep.value.connected) {
		logger.info('Connect to OBS automatically.');
		connect();
	}
};
