import {NodeCG} from 'nodecg/types/server';
import {Checklist, ChecklistCompleted, ReplicantName as R} from '../replicants';
import defaultChecklist from './default/checklist';

export const checklist = (nodecg: NodeCG) => {
	const checklistRep = nodecg.Replicant<Checklist>(R.Checklist, {
		defaultValue: defaultChecklist,
	});
	const checklistCompleted = nodecg.Replicant<ChecklistCompleted>(
		R.ChecklistCompleted,
		{defaultValue: false},
	);

	const toggleCheckbox = (payload: {name: string; checked: boolean}) => {
		for (const checklistItem of checklistRep.value) {
			if (checklistItem.name === payload.name) {
				checklistItem.complete = payload.checked;
				break;
			}
		}
	};

	const resetChecklist = () => {
		for (const item of checklistRep.value) {
			item.complete = false;
		}
	};

	const updateChecklistComplete = () => {
		checklistCompleted.value = checklistRep.value.every(
			(category) => category.complete,
		);
	};

	checklistRep.on('change', updateChecklistComplete);
	nodecg.listenFor('toggleCheckbox', toggleCheckbox);
	nodecg.listenFor('resetChecklist', resetChecklist);
};
