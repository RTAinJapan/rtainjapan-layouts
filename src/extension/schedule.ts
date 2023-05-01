import {cloneDeep} from "lodash";
import {NodeCG} from "./nodecg";

export default async (nodecg: NodeCG) => {
	const scheduleRep = nodecg.Replicant("schedule");
	const currentRunRep = nodecg.Replicant("current-run");
	const nextRunRep = nodecg.Replicant("next-run");
	const timerRep = nodecg.Replicant("timer");

	const updateCurrentRun = (index: number) => {
		if (timerRep.value?.timerState === "Running") {
			return;
		}
		if (!scheduleRep.value) {
			return;
		}
		const newCurrentRun = scheduleRep.value[index];
		if (!newCurrentRun) {
			return;
		}
		currentRunRep.value = cloneDeep(newCurrentRun);
		nextRunRep.value = cloneDeep(scheduleRep.value[index + 1]);
	};

	const seekToNextRun = () => {
		if (timerRep.value?.timerState === "Running") {
			return;
		}
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
		currentRunRep.value = cloneDeep(nextRunRep.value);
		nextRunRep.value = cloneDeep(scheduleRep.value[currentIndex + 2]);
	};

	const seekToPreviousRun = () => {
		if (timerRep.value?.timerState === "Running") {
			return;
		}
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
		nextRunRep.value = cloneDeep(currentRunRep.value);
		currentRunRep.value = cloneDeep(scheduleRep.value[currentIndex - 1]);
	};

	nodecg.listenFor("nextRun", (_, cb) => {
		seekToNextRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("previousRun", (_, cb) => {
		seekToPreviousRun();
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("setCurrentRunByIndex", (index, cb) => {
		updateCurrentRun(index);
		if (cb && !cb.handled) {
			cb(null);
		}
	});

	nodecg.listenFor("modifyRun", (data, cb) => {
		let msg: string | null = null;

		try {
			if (currentRunRep.value && currentRunRep.value.pk === data.pk) {
				currentRunRep.value = {...currentRunRep.value, ...data};
			} else if (nextRunRep.value && nextRunRep.value.pk === data.pk) {
				nextRunRep.value = {...nextRunRep.value, ...data};
			} else {
				nodecg.log.warn("[modifyRun] run not found:", data);
				msg = "Error: Run not found";
			}

			if (cb && !cb.handled) {
				cb(msg);
			}
		} catch (error) {
			if (cb && !cb.handled) {
				cb(error instanceof Error ? error.message : "error");
			}
		}
	});

	// Prevent empty current run
	scheduleRep.on("change", (newVal) => {
		const isCurrentRunEmpty = !currentRunRep.value || !currentRunRep.value.pk;
		if (isCurrentRunEmpty) {
			const currentRun = newVal[0];
			if (currentRun) {
				currentRunRep.value = cloneDeep(currentRun);
				nextRunRep.value = cloneDeep(newVal[1]);
			}
		}
	});
};
