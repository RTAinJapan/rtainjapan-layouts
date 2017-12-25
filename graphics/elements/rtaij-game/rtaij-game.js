/* global textFit */
(function () {
	const currentRun = nodecg.Replicant('currentRun');

	class RtaijGame extends Polymer.Element {
		static get is() {
			return 'rtaij-game';
		}

		ready() {
			super.ready();

			currentRun.on('change', newVal => {
				this.title = newVal.title;
				this.category = newVal.category;
				this.hardware = newVal.hardware;
				textFit(this.$.title, {maxFontSize: 63});
				textFit(this.$.misc, {maxFontSize: 32});
			});
		}
	}

	customElements.define(RtaijGame.is, RtaijGame);
})();
