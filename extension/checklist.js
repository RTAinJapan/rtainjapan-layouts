const defaultChecklist = require('./default/checklist.json');

module.exports = nodecg => {
	const checklist = nodecg.Replicant('checklist', {
		defaultValue: defaultChecklist
	});
	const checklistComplete = nodecg.Replicant('checklistComplete', {
		defaultValue: false
	});

	nodecg.listenFor('toggleCheckbox', toggleCheckbox);
	nodecg.listenFor('resetChecklist', reset);

	checklist.on('change', updateChecklistComplete);

	/**
	 * Toggles an item
	 * @param {Boolean} isChecked - Whether or not the item is checked
	 * @param {Number} category - Index of the category you want to modify
	 * @param {Number} item - Index of item you want to modify
	 */
	function toggleCheckbox({name, checked}) {
		checklist.value.find(task => {
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
		checklist.value.forEach(item => {
			item.complete = false;
		});
	}

	/**
	 * Updates checklistComplete Replicant
	 */
	function updateChecklistComplete() {
		checklistComplete.value = checklist.value.every(
			category => category.complete
		);
	}
};
