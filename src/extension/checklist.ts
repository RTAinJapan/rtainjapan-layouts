import {clone} from "lodash";
import {NodeCG} from "./nodecg";
import {v4 as uuid} from "uuid";
import {Run} from "../nodecg/generated";

export const checklist = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("checklist");
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

	const complete = (run: Run, checklistPk: string) => {
		run.completedChecklist = [...run.completedChecklist, checklistPk];
	};

	const uncomplete = (run: Run, checklistPk: string) => {
		run.completedChecklist = run.completedChecklist.filter(
			(pk) => pk !== checklistPk,
		);
	};

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
			scheduleRun && complete(scheduleRun, payload.checkPk);
			currentRunRep.value?.pk === payload.runPk &&
				complete(currentRunRep.value, payload.checkPk);
			nextRunRep.value?.pk === payload.runPk &&
				complete(nextRunRep.value, payload.checkPk);
		} else {
			scheduleRun && uncomplete(scheduleRun, payload.checkPk);
			currentRunRep.value?.pk === payload.runPk &&
				uncomplete(currentRunRep.value, payload.checkPk);
			nextRunRep.value?.pk === payload.runPk &&
				uncomplete(nextRunRep.value, payload.checkPk);
		}
	};

	nodecg.listenFor("toggleCheckbox", toggleCheckbox);
};
