(() => {
	const currentRun = nodecg.Replicant('currentRun');
	const nextRun = nodecg.Replicant('nextRun');
	const schedule = nodecg.Replicant('schedule');

	class RtaijSchedule extends Polymer.Element {
		static get is() {
			return 'rtaij-schedule';
		}

		ready() {
			super.ready();

			schedule.on('change', newVal => {
				if (!newVal) {
					return;
				}
				this.$.typeahead.items = newVal
					// Filter out setup
					.filter(item => item.pk !== -1)
					.map(run => run.title);
				this._checkButtons();
			});

			currentRun.on('change', newVal => {
				if (!newVal) {
					return;
				}
				this.$.currentRun.setRun(newVal);
				this._checkButtons();
			});

			nextRun.on('change', newVal => {
				if (newVal) {
					this.$.nextRun.setRun(newVal);
					// This.$.editNext.removeAttribute('disabled');
				} else {
					this.$.nextRun.setRun({});
					// This.$.editNext.setAttribute('disabled', 'true');
				}
				this._checkButtons();
			});
		}

		/**
		 * Takes the current value of the typeahead and loads that as the current speedrun.
		 * Shows a helpful error toast if no matching speedrun could be found.
		 */
		takeTypeahead() {
			const nameToFind = this.$.typeahead.value;

			// Find the run based on the name
			const matched = schedule.value.some(run => {
				if (run.pk === -1) {
					return false;
				}
				if (run.title.toLowerCase() === nameToFind.toLowerCase()) {
					this._pendingSetCurrentRunByOrderMessageResponse = true;
					this._checkButtons();
					nodecg.sendMessage('setCurrentRunByIndex', run.index, () => {
						this._pendingSetCurrentRunByOrderMessageResponse = false;
						this._checkButtons();
						this.$.typeahead.value = '';
						this.$.typeahead._suggestions = [];
					});
					return true;
				}
				return false;
			});
			if (!matched) {
				this.$.toast.show(`「${nameToFind}」という名前のゲームは見つかりませんでした`);
			}
		}

		next() {
			this._pendingNextRunMessageResponse = true;
			this._checkButtons();
			nodecg.sendMessage('nextRun', () => {
				this._pendingNextRunMessageResponse = false;
				this._checkButtons();
			});
		}

		previous() {
			this._pendingPreviousRunMessageResponse = true;
			this._checkButtons();
			nodecg.sendMessage('previousRun', () => {
				this._pendingPreviousRunMessageResponse = false;
				this._checkButtons();
			});
		}

		_checkButtons() {
			if (
				schedule.status !== 'declared' ||
				currentRun.status !== 'declared' ||
				nextRun.status !== 'declared'
			) {
				return;
			}

			const prevRunExists = schedule.value.find(run => {
				return run.index < currentRun.value.index;
			});

			const shouldDisableAll =
				this._pendingSetCurrentRunByOrderMessageResponse ||
				this._pendingPreviousRunMessageResponse ||
				this._pendingNextRunMessageResponse;

			const shouldDisableNext = !nextRun.value;
			const shouldDisablePrev = !currentRun.value || !prevRunExists;
			const shouldDisableTake = shouldDisableAll;

			if (shouldDisableAll || shouldDisableNext) {
				this.$.next.setAttribute('disabled', 'true');
			} else {
				this.$.next.removeAttribute('disabled');
			}

			if (shouldDisableAll || shouldDisablePrev) {
				this.$.previous.setAttribute('disabled', 'true');
			} else {
				this.$.previous.removeAttribute('disabled');
			}

			if (shouldDisableTake) {
				this.$.take.setAttribute('disabled', 'true');
			} else {
				this.$.take.removeAttribute('disabled');
			}
		}

		_typeaheadKeyup(event) {
			if (event.which === 13 && this.$.typeahead.inputValue) {
				this.takeTypeahead();
			}
		}
	}

	customElements.define(RtaijSchedule.is, RtaijSchedule);
})();
