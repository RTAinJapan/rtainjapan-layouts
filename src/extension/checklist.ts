import defaultChecklist from './default/checklist';
import {NodeCG} from './nodecg';

export const checklist = (nodecg: NodeCG) => {
	const checklistRep = nodecg.Replicant('checklist', {
		defaultValue: defaultChecklist,
	});
	const checklistCompleted = nodecg.Replicant('checklist-completed', {
		defaultValue: false,
	});

	const toggleCheckbox = (payload: {name: string; checked: boolean}) => {
		if (!checklistRep.value) {
			return;
		}
		for (const checklistItem of checklistRep.value) {
			if (checklistItem.name === payload.name) {
				checklistItem.complete = payload.checked;
				break;
			}
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

	const updateChecklistComplete = () => {
		if (!checklistRep.value) {
			return;
		}
		checklistCompleted.value = checklistRep.value.every(
			(category) => category.complete,
		);
	};

	checklistRep.on('change', updateChecklistComplete);
	nodecg.listenFor('toggleCheckbox', toggleCheckbox);
	nodecg.listenFor('resetChecklist', resetChecklist);
};
