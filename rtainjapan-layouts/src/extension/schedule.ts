import cloneDeep from 'lodash/cloneDeep';
import {NodeCG} from 'nodecg/types/server';
import {
	Checklist,
	CurrentRun,
	NextRun,
	ReplicantName as R,
	Run,
	Schedule,
} from '../replicants';

const getDefaultRun = (): Run => ({
	category: '',
	duration: '',
	index: 0,
	pk: 0,
	platform: '',
	scheduled: 0,
	title: '',
	runners: [],
	commentators: [],
});

export default (nodecg: NodeCG) => {
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

	const resetChecklist = () => {
		checklistRep.value = checklistRep.value.map(item => ({
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
	});

	// Prevent empty current run
	scheduleRep.on('change', newVal => {
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
};
