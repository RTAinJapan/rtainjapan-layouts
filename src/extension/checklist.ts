import {clone} from "lodash";
import {NodeCG} from "./nodecg";
import {v4 as uuid} from "uuid";

export const checklist = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("tracker");
	const checklistRep = nodecg.Replicant("checklist");
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
				complete: false,
			}
		);
	});

	const toggleCheckbox = (payload: {name: string; checked: boolean}) => {
		if (!checklistRep.value) {
			return;
		}
		const item = checklistRep.value.find((item) => item.name === payload.name);
		if (item) {
			item.complete = payload.checked;
		}
	};

	const resetChecklist = () => {
		if (!checklistRep.value) {
			return;
		}
		for (const item of checklistRep.value) {
			item.complete = false;
		}
	};

	nodecg.listenFor("toggleCheckbox", toggleCheckbox);
	nodecg.listenFor("resetChecklist", resetChecklist);
};
