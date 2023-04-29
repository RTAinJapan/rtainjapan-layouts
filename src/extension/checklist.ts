import {clone} from "lodash";
import {NodeCG} from "./nodecg";
import {v4 as uuid} from "uuid";

export const checklist = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("tracker");
	const checklistRep = nodecg.Replicant("checklist");
	const scheduleRep = nodecg.Replicant("schedule");
	const currentRunRep = nodecg.Replicant("current-run");
	const nextRunRep = nodecg.Replicant("next-run");
	const checklist = nodecg.bundleConfig.checklist;

	if (!checklist) {
		log.warn("checklist is not configured in the bundle config");
		return;
	}

	const configChecklistNames = [...new Set(checklist)];

	const currentChecklist = checklistRep.value ? clone(checklistRep.value) : [];

	checklistRep.value = configChecklistNames.map((name) => {
		const existsCurrent = currentChecklist.find((c) => c.name === name);

		return (
			existsCurrent ?? {
				pk: uuid(),
				name,
			}
		);
	});

	const toggleCheckbox = (payload: {
		runPk: number;
		checkPk: string;
		checked: boolean;
	}) => {
		if (!checklistRep.value || !scheduleRep.value) {
			return;
		}

		const scheduleRun = scheduleRep.value.find(
			(run) => run.pk === payload.runPk,
		);

		if (payload.checked) {
			scheduleRun &&
				(scheduleRun.completedChecklist = [
					...scheduleRun.completedChecklist,
					payload.checkPk,
				]);
			currentRunRep.value?.pk === payload.runPk &&
				(currentRunRep.value.completedChecklist = [
					...currentRunRep.value.completedChecklist,
					payload.checkPk,
				]);
			nextRunRep.value?.pk === payload.runPk &&
				(nextRunRep.value.completedChecklist = [
					...nextRunRep.value.completedChecklist,
					payload.checkPk,
				]);
		} else {
			scheduleRun &&
				(scheduleRun.completedChecklist = scheduleRun.completedChecklist.filter(
					(pk) => pk !== payload.checkPk,
				));
			currentRunRep.value?.pk === payload.runPk &&
				(currentRunRep.value.completedChecklist =
					currentRunRep.value.completedChecklist.filter(
						(pk) => pk !== payload.checkPk,
					));
			nextRunRep.value?.pk === payload.runPk &&
				(nextRunRep.value.completedChecklist =
					nextRunRep.value.completedChecklist.filter(
						(pk) => pk !== payload.checkPk,
					));
		}
	};

	nodecg.listenFor("toggleCheckbox", toggleCheckbox);
};
