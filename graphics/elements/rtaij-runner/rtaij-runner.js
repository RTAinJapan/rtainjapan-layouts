(function () {
	const SOCIAL_FADE_INTERVAL = nodecg.bundleConfig.graphicAnime.socialFadeInterval * 1000;
	const SOCIAL_FADE_DELAY = 0.33 * 1000;

	const currentRun = nodecg.Replicant('currentRun');
	const stopwatch = nodecg.Replicant('stopwatch');

	class RtaijRunner extends Polymer.Element {
		static get is() {
			return 'rtaij-runner';
		}

		static get properties() {
			return {
				index: {
					type: Number,
					value: 0
				}
			};
		}

		ready() {
			super.ready();

			currentRun.on('change', newVal => {
				clearInterval(this.socialInterval);
				
				this.runners = newVal.runners;
				this.runner = newVal.runners[this.index];

				this.calcFinishTime();

				['twitch', 'nico', 'twitter'].forEach(media => {
					this.$[media].style.opacity = 0;
				});

				if (!this.runner) {
					return;
				}

				const medias = ['twitch', 'nico', 'twitter']
					.filter(media => this.runner[media]);

				if (medias.length === 0) {
					return;
				}

				this.$[medias[0]].style.opacity = 1;

				if (medias.length <= 1) {
					return;
				}

				let currentMediaIndex = 0;
				this.socialInterval = setInterval(() => {
					this.$[medias[currentMediaIndex]].style.opacity = 0;
					currentMediaIndex = (currentMediaIndex + 1) % medias.length;
					setTimeout(() => {
						this.$[medias[currentMediaIndex]].style.opacity = 1;
					}, SOCIAL_FADE_DELAY);
				}, SOCIAL_FADE_INTERVAL + SOCIAL_FADE_DELAY);
			});

			stopwatch.on('change', newVal => {
				this.result = newVal.results[this.index];
				this.calcFinishTime();
			});
		}

		calcFinishTime() {
			if (this.runners.length <= 1) {
				this.$.finish_time.style.opacity = 0;
				return;
			}
			if (this.result) {
				this.finishTime = this.result.formatted;
				this.$.finish_time.style.opacity = 1;
			} else {
				this.finishTime = '';
				this.$.finish_time.style.opacity = 0;
			}
		}
	}

	customElements.define(RtaijRunner.is, RtaijRunner);
})();
