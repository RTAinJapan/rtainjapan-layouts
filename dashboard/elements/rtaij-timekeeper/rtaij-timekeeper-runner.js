(() => {
	class RtaijTimekeeperRunner extends Polymer.Element {
		static get is() {
			return 'rtaij-timekeeper-runner';
		}

		static get properties() {
			return {
				index: {
					type: Number
				},
				runner: {
					type: Object
				}
			};
		}

		finish() {
			nodecg.sendMessage('completeRunner', {index: this.index, forfeit: false});
		}

		resume() {
			nodecg.sendMessage('resumeRunner', this.index);
		}

		forfeit() {
			nodecg.sendMessage('completeRunner', {index: this.index, forfeit: true});
		}

		editTime() {
			this.dispatchEvent(new CustomEvent(`edit-time`, {bubbles: true, composed: true}));
		}

		calcRunnerStatus(results, index) {
			if (!results) {
				return;
			}
			if (results[index]) {
				return results[index].formatted;
			}
			return 'Running';
		}

		calcRunnerStatusClass(results, index) {
			if (!results) {
				return;
			}
			if (results[index] && !results[index].forfeit) {
				return 'finished';
			}
			return '';
		}

		calcFinishHidden(results, index) {
			if (!results) {
				return;
			}
			return results[index] && !results[index].forfeit;
		}

		calcForfeitHidden(results, index) {
			if (!results) {
				return;
			}
			return results[index] && results[index].forfeit;
		}

		calcResumeHidden(results, index) {
			if (!results) {
				return;
			}
			return !results[index];
		}

		calcEditDisabled(results, runnerIndex) {
			if (!results) {
				return;
			}
			return !results[runnerIndex];
		}
	}

	customElements.define(RtaijTimekeeperRunner.is, RtaijTimekeeperRunner);
})();
