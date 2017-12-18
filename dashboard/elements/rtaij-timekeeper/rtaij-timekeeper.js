(() => {
	const stopwatch = nodecg.Replicant('stopwatch');
	const currentRun = nodecg.Replicant('currentRun');
	const checklistComplete = nodecg.Replicant('checklistComplete');

	class RtaijTimekeeper extends Polymer.Element {
		static get is() {
			return 'rtaij-timekeeper';
		}

		static get properties() {
			return {
				checklistComplete: {
					type: Boolean,
					reflectToAttribute: true,
					value: false
				},
				state: {
					type: String,
					reflectToAttribute: true
				},
				paused: {
					type: Boolean,
					reflectToAttribute: true
				}
			};
		}

		ready() {
			super.ready();

			stopwatch.on('change', newVal => {
				this.state = newVal.state;
				this.time = newVal.formatted;
				// Duplicate the array
				this.results = newVal.results.slice(0);
				this.paused = newVal.state === 'stopped' && newVal.raw > 0;
			});

			currentRun.on('change', newVal => {
				// Duplicate the array
				const runners = newVal.runners.slice(0);
				// Make it have 4 items
				runners.length = 4;
				// Force all falsy items to false
				runners.forEach((item, index, array) => {
					array[index] = item || false;
				});
				this.runners = runners;
			});

			checklistComplete.on('change', newVal => {
				this.checklistComplete = newVal;
			});
		}

		startTimer() {
			nodecg.sendMessage('startTimer');
		}

		calcStartDisabled(checklistComplete, state) {
			return !checklistComplete || state !== 'stopped';
		}

		stopTimer() {
			nodecg.sendMessage('stopTimer');
		}

		calcPauseDisabled(state) {
			return state !== 'running';
		}

		confirmReset() {
			this.$.resetDialog.open();
		}

		resetTimer() {
			nodecg.sendMessage('resetTimer');
		}

		editMasterTime() {
			this.$['editDialog-text'].textContent = `新しい全体タイマーのタイム`;
			this.$.editDialog.setAttribute('data-index', 'master');
			this.$['editDialog-input'].value = this.time;
			this.$.editDialog.open();
		}

		editRunnerTime(e) {
			this.$['editDialog-text'].innerHTML = `新しい<b>${e.model.runner.name}</b>のタイム`;
			this.$.editDialog.setAttribute('data-index', e.model.index);
			this.$['editDialog-input'].value = this.results[e.model.index].formatted;
			this.$.editDialog.open();
		}

		saveEditedTime() {
			nodecg.sendMessage('editTime', {
				index: this.$.editDialog.getAttribute('data-index'),
				newTime: this.$['editDialog-input'].value
			});
			this.$['editDialog-text'].textContent = '';
			this.$['editDialog-input'].value = '';
		}
	}

	customElements.define(RtaijTimekeeper.is, RtaijTimekeeper);
})();
