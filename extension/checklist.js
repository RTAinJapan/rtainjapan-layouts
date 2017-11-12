const path = require('path');

const defaultChecklist = require(path.join(__dirname, 'default/checklist.json'));

module.exports = nodecg => {
	const checklist = nodecg.Replicant('checklist', {defaultValue: defaultChecklist});
	const checklistCompleted = nodecg.Replicant('checklistCompleted', {defaultValue: false});

	nodecg.listenFor('toggleChecklist', toggleCheck);
	nodecg.listenFor('resetChecklist', reset);

	checklist.on('change', updateChecklistCompleted);

	/**
	 * Toggle an item
	 * @param {Boolean} isChecked - Whether or not the item is checked
	 * @param {Number} category - Index of the category you want to modify
	 * @param {Number} item - Index of item you want to modify
	 */
	function toggleCheck(isChecked, category, item) {
		checklist.value[category].items[item].value = isChecked;
	}

	/**
	 * Resets all checklist to default
	 */
	function reset() {
		checklist.value.left.forEach(item => {
			item.value = item.default;
		});
	}

	/**
	 * Updates checklistCompleted Replicant
	 */
	function updateChecklistCompleted() {
		checklistCompleted.value = checklist.value.every(category => {
			return category.items.every(item => item.value)
		});
	}
};
