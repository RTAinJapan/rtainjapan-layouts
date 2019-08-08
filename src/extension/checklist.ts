import defaultChecklist from './default/checklist';
import {NodeCG} from './nodecg';

export const checklist = (nodecg: NodeCG) => {
	const checklistRep = nodecg.Replicant('checklist', {
		defaultValue: defaultChecklist,
	});

	const toggleCheckbox = (payload: {name: string; checked: boolean}) => {
		if (!checklistRep.value) {
			return;
		}
		const item = checklistRep.value.find(
			(item) => item.name === payload.name,
		);
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
