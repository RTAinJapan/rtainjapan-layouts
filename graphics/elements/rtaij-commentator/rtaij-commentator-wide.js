(function () {
	const SOCIAL_FADE_INTERVAL = nodecg.bundleConfig.graphicAnime.socialFadeInterval * 1000;
	const SOCIAL_FADE_DELAY = 0.33 * 1000;

	const currentRun = nodecg.Replicant('currentRun');
	const stopwatch = nodecg.Replicant('stopwatch');

	class RtaijCommentatorWide extends Polymer.Element {
		static get is() {
			return 'rtaij-commentator-wide';
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
				this.commentators = newVal.commentators;
				this.commentator = newVal.commentators[this.index];

				['twitch', 'nico', 'twitter'].forEach(media => {
					this.$[media].style.opacity = 0;
				});
				if (this.socialInterval) {
					clearInterval(this.socialInterval);
				}

				const medias = ['twitch', 'nico', 'twitter']
					.filter(media => this.commentator[media]);

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
			});
		}
	}

	customElements.define(RtaijCommentatorWide.is, RtaijCommentatorWide);
})();
