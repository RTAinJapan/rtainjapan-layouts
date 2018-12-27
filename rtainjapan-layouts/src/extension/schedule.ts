import cloneDeep from 'lodash/cloneDeep';
import {NodeCG} from 'nodecg/types/server';
import BundleConfig from '../bundle-config';
import {
	Checklist,
	CurrentRun,
	NextRun,
	ReplicantName as R,
	Run,
	Schedule,
} from '../replicants';
import {getAuth, getData} from './util/spreadsheet';

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
	const bundleConfig: BundleConfig = nodecg.bundleConfig;
	const scheduleRep = nodecg.Replicant<Schedule>(R.Schedule, {
		defaultValue: [],
	});
	const currentRunRep = nodecg.Replicant<CurrentRun>(R.CurrentRun, {
		defaultValue: getDefaultRun(),
	});
	const nextRunRep = nodecg.Replicant<NextRun>(R.NextRun, {
		defaultValue: getDefaultRun(),
	});
	const checklistRep = nodecg.Replicant<Checklist>(R.Checklist);

	const googleApiAuth = await getAuth(
		bundleConfig.googleApi.clientEmail,
		bundleConfig.googleApi.privateKey,
	);

	const getGamesData = async () =>
		getData(bundleConfig.googleApi.spreadsheetId, googleApiAuth);

	const resetChecklist = () => {
		checklistRep.value = checklistRep.value.map((item) => ({
			...item,
			complete: false,
		}));
	};

	const updateCurrentRun = (index: number) => {
		resetChecklist();
		const newCurrentRun = scheduleRep.value[index];
		if (!newCurrentRun) {
			return;
		}
		currentRunRep.value = cloneDeep(newCurrentRun);
		nextRunRep.value = cloneDeep(scheduleRep.value[index + 1]);
	};

	const seekToNextRun = () => {
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
			cb();
		}
	});

	nodecg.listenFor('previousRun', (_, cb) => {
		seekToPreviousRun();
		if (cb && !cb.handled) {
			cb();
		}
	});

	nodecg.listenFor('setCurrentRunByIndex', (index, cb) => {
		updateCurrentRun(index);
		if (cb && !cb.handled) {
			cb();
		}
	});

	nodecg.listenFor('modifyRun', (data, cb) => {
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
