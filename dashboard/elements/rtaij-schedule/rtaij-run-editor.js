class RtaijRunEditor extends Polymer.Element {
	static get is() {
		return 'rtaij-run-editor';
	}

	loadRun(run) {
		this.title = run.title;
		this.category = run.category;
		this.estimate = 'TODO';
		this.hardware = run.hardware;
		this.runners = run.runners.map(runner => {
			if (runner) {
				return {
					name: runner.name,
					twitch: runner.twitch,
					nico: runner.nico,
					twitter: runner.twitter
				};
			}
			return undefined;
		});
		this.pk = run.pk;
	}

	applyChanges() {
		const runners = [];
		const runnerNameInputs = Polymer.dom(this.$.runners).querySelectorAll(
			'paper-input[label^="走者"]'
		);
		const runnerTwitchInputs = Polymer.dom(this.$.runners).querySelectorAll(
			'paper-input[label="Twitch"]'
		);
		const runnerNicoInputs = Polymer.dom(this.$.runners).querySelectorAll(
			'paper-input[label="ニコニコ"]'
		);
		const runnerTwitterInputs = Polymer.dom(this.$.runners).querySelectorAll(
			'paper-input[label="Twitter"]'
		);

		for (let i = 0; i < 4; i++) {
			if (
				runnerNameInputs[i].value ||
				runnerTwitchInputs[i].value ||
				runnerNicoInputs[i].value ||
				runnerTwitterInputs[i].value
			) {
				runners[i] = {
					name: runnerNameInputs[i].value,
					twitch: runnerTwitchInputs[i].value,
					nico: runnerNicoInputs[i].value,
					twitter: runnerTwitterInputs[i].value
				};
			}
		}
		nodecg.sendMessage(
			'modifyRun',
			{
				title: this.title,
				category: this.category,
				// TODO: Estimate,
				hardware: this.hardware,
				runners,
				pk: this.pk
			},
			() => {
				this.closest('paper-dialog').close();
			}
		);
	}
}

customElements.define(RtaijRunEditor.is, RtaijRunEditor);
