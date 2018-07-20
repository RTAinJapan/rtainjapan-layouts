import defaultChecklist from './default/checklist.json';
import {NodeCG} from '../../types/nodecg';

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
		checklistRep.value.find(task => {
			if (task.name === name) {
				task.complete = checked;
				return true;
			}
			return false;
		});
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
