import {NodeCG} from 'nodecg/types/server';
import defaultChecklist from './default/checklist';

export const checklist = (nodecg: NodeCG) => {
	const checklistRep = nodecg.Replicant('checklist', {
		defaultValue: defaultChecklist,
	});
	const checklistComplete = nodecg.Replicant('checklistComplete', {
		defaultValue: false,
	});

	nodecg.listenFor('toggleCheckbox', toggleCheckbox);
	nodecg.listenFor('resetChecklist', reset);

	checklistRep.on('change', updateChecklistComplete);

	function toggleCheckbox({name, checked}: {name: string; checked: boolean}) {
		const checklistItem = checklistRep.value.find(
			task => task.name === name
		);
		if (checklistItem) {
			checklistItem.complete = checked;
		}
	}

	/**
	 * Resets all checklist to default
	 */
	function reset() {
		checklistRep.value.forEach(item => {
			item.complete = false;
		});
	}

	/**
	 * Updates checklistComplete Replicant
	 */
	function updateChecklistComplete() {
		checklistComplete.value = checklistRep.value.every(
			category => category.complete
		);
	}
};
