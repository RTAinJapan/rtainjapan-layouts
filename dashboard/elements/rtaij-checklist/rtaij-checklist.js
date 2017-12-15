(() => {
	const checklist = nodecg.Replicant('checklist');

	// eslint-disable-next-line new-cap
	class RtaijChecklist extends Polymer.MutableData(Polymer.Element) {
		static get is() {
			return 'rtaij-checklist';
		}

		ready() {
			super.ready();
			checklist.on('change', newVal => {
				const leftRowsNumber = Math.ceil(newVal.length / 2);
				this.leftChecklist = newVal.slice(0, leftRowsNumber);
				this.rightChecklist = newVal.slice(leftRowsNumber);
			});
		}

		checkedChanged(event) {
			const target = event.path[0];
			nodecg.sendMessage('toggleCheckbox', {
				name: target.name,
				checked: target.checked
			});
		}
	}

	customElements.define(RtaijChecklist.is, RtaijChecklist);
})();
