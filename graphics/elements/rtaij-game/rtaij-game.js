/* global textFit */
(function () {
	const currentRun = nodecg.Replicant('currentRun');

	class RtaijGame extends Polymer.Element {
		static get is() {
			return 'rtaij-game';
		}

		static get properties() {
			return {
				title: String,
				category: String,
				hardware: String
			};
		}

		ready() {
			super.ready();

			currentRun.on('change', newVal => {
				this.title = newVal.title.replace(/\\n/ig, '<br/>');
				this.category = newVal.category;
				this.hardware = newVal.hardware;

				this.$.title.innerHTML = this.title;
				const hardware = this.hardware ? ` - ${this.hardware}` : '';
				this.$.misc.innerHTML = this.category + hardware;

				this.fitText();
			});
		}

		fitText() {
			textFit(this.$.title, {maxFontSize: 69.3});
			const titleFontSize = Number(
				this.$.title.firstChild.style['font-size'].replace('px', '')
			);
			textFit(this.$.misc, {
				maxFontSize: titleFontSize < 48 ? titleFontSize : 48
			});
		}
	}
	customElements.define(RtaijGame.is, RtaijGame);
})();
