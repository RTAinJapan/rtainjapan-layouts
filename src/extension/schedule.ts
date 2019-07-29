import cloneDeep from 'lodash/cloneDeep';
import {getAuth, getData} from './util/spreadsheet';
import {Run} from '../nodecg/replicants';
import {NodeCG} from './nodecg';

const getDefaultRun = (): Run => ({
	category: '',
	duration: '0:10:00',
	index: 0,
	pk: 0,
	platform: '',
	scheduled: 0,
	title: '',
	runners: [],
	commentators: [],
});

const hmsToMs = (hms: string) => {
	const [h, m, s] = hms.split(':');
	return (
		((parseInt(h, 10) * 60 + parseInt(m, 10)) * 60 + parseInt(s, 10)) * 1000
	);
};

export default async (nodecg: NodeCG) => {
	const googleApiConfig = nodecg.bundleConfig.googleApi;
	if (!googleApiConfig) {
		return;
	}

	const scheduleRep = nodecg.Replicant('schedule', {
		defaultValue: [],
	});
	const currentRunRep = nodecg.Replicant('current-run', {
		defaultValue: getDefaultRun(),
	});
	const nextRunRep = nodecg.Replicant('next-run', {
		defaultValue: getDefaultRun(),
	});
	const checklistRep = nodecg.Replicant('checklist');

	const googleApiAuth = await getAuth(
		googleApiConfig.clientEmail,
		googleApiConfig.privateKey,
	);

	const getGamesData = async () =>
		getData(googleApiConfig.spreadsheetId, googleApiAuth);

	const resetChecklist = () => {
		if (checklistRep.value) {
			checklistRep.value = checklistRep.value.map((item) => ({
				...item,
				complete: false,
			}));
		}
	};

	const updateCurrentRun = (index: number) => {
		if (!scheduleRep.value) {
			return;
		}
		resetChecklist();
		const newCurrentRun = scheduleRep.value[index];
		if (!newCurrentRun) {
			return;
		}
		currentRunRep.value = cloneDeep(newCurrentRun);
		nextRunRep.value = cloneDeep(scheduleRep.value[index + 1]);
	};

	const seekToNextRun = () => {
		if (!currentRunRep.value || !scheduleRep.value) {
			return;
		}
		const currentIndex = currentRunRep.value.index;
		if (currentIndex === undefined || currentIndex < 0) {
			updateCurrentRun(0);
			return;
		}
		if (currentIndex >= scheduleRep.value.length - 1) {
			return;
		}
		resetChecklist();
		currentRunRep.value = cloneDeep(nextRunRep.value);
		nextRunRep.value = cloneDeep(scheduleRep.value[currentIndex + 2]);
	};

	const seekToPreviousRun = () => {
		if (!currentRunRep.value || !scheduleRep.value) {
			return;
		}
		const currentIndex = currentRunRep.value.index;
		if (currentIndex === undefined || currentIndex < 0) {
			updateCurrentRun(0);
			return;
		}
		if (currentIndex === 0) {
			return;
		}
		resetChecklist();
		nextRunRep.value = cloneDeep(currentRunRep.value);
		currentRunRep.value = cloneDeep(scheduleRep.value[currentIndex - 1]);
	};

	nodecg.listenFor('nextRun', (_, cb) => {
		seekToNextRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('previousRun', (_, cb) => {
		seekToPreviousRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('setCurrentRunByIndex', (index, cb) => {
		updateCurrentRun(index);
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor('modifyRun', (data, cb) => {
		if (!currentRunRep.value || !nextRunRep.value) {
			return;
		}

		let msg: string | null = null;

		try {
			switch (data.pk) {
				case currentRunRep.value.pk:
					currentRunRep.value = {...currentRunRep.value, ...data};
					break;
				case nextRunRep.value.pk:
					nextRunRep.value = {...nextRunRep.value, ...data};
					break;
				default:
					nodecg.log.warn('[modifyRun] run not found:', data);
					msg = 'Error: Run not found';
					break;
			}
			if (cb && !cb.handled) {
				cb(msg);
			}
		} catch (error) {
			if (cb && !cb.handled) {
				cb(error.message);
			}
		}
	});

	// Prevent empty current run
	scheduleRep.on('change', (newVal) => {
		const isCurrentRunEmpty =
			!currentRunRep.value || !currentRunRep.value.pk;
		if (isCurrentRunEmpty) {
			const currentRun = newVal[0];
			if (currentRun) {
				currentRunRep.value = cloneDeep(currentRun);
				nextRunRep.value = cloneDeep(newVal[1]);
			}
		}
	});

	const update = async () => {
		try {
			const fetchedData = await getGamesData();
			let startTime = new Date('2018-12-27T12:00:00+0900').getTime();
			scheduleRep.value = fetchedData.map((game, index) => {
				const scheduleGame = {
					...game,
					duration: game.runDuration,
					pk: index,
					index,
					scheduled: startTime,
					commentators: [],
				};
				startTime += hmsToMs(game.runDuration);
				startTime += hmsToMs(game.setupDuration);
				return scheduleGame;
			});
		} catch (err) {
			nodecg.log.error('Error while fetching schedule from spreadsheet');
			nodecg.log.error(err);
		}
	};
	update();
	setInterval(update, 60 * 1000);
};
