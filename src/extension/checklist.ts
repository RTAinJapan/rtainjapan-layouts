import {isEqual} from 'lodash';
import defaultChecklist from './default/checklist';
import {NodeCG} from './nodecg';

export const checklist = (nodecg: NodeCG) => {
	const checklistRep = nodecg.Replicant('checklist', {
		defaultValue: defaultChecklist,
	});
	if (checklistRep.value) {
		const currentNameList = checklistRep.value.map((item) => item.name);
		const defaultNameList = defaultChecklist.map((item) => item.name);
		if (!isEqual(currentNameList, defaultNameList)) {
			if (checklistRep.value.every((item) => item.complete)) {
				checklistRep.value = defaultChecklist.map((item) => ({
					name: item.name,
					complete: true,
				}));
			} else {
				checklistRep.value = defaultChecklist;
			}
		}
	}

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

	nodecg.listenFor('toggleCheckbox', toggleCheckbox);
	nodecg.listenFor('resetChecklist', resetChecklist);
};
