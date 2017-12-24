(function () {
	const sponsorLogos = nodecg.Replicant('assets:sponsorLogos');

	const SPONSOR_FADE_INTERVAL = nodecg.bundleConfig.graphicAnime.sponsorFadeInterval * 1000;
	const SPONSOR_FADE_DELAY = 0.33 * 1000;

	class RtaijOverlay extends Polymer.Element {
		static get is() {
			return 'rtaij-overlay';
		}

		ready() {
			super.ready();

			sponsorLogos.on('change', newVal => {
				this.$.sponsor_logo.style.opacity = 0;

				const sponsorUrls = newVal.map(logo => logo.url).reverse();

				if (sponsorUrls.length === 0) {
					return;
				}

				const showElement = index => {
					this.logoUrl = sponsorUrls[index];
					this.$.sponsor_logo.style.opacity = 1;
				};
				const hideElement = () => {
					this.$.sponsor_logo.style.opacity = 0;
				};

				if (this.sponsorInterval) {
					clearInterval(this.sponsorInterval);
				}

				showElement(0);

				if (sponsorUrls.length <= 1) {
					return;
				}

				let currentSponsorIndex = 0;
				this.sponsorInterval = setInterval(() => {
					hideElement();
					currentSponsorIndex = (currentSponsorIndex + 1) % sponsorUrls.length;
					setTimeout(() => {
						showElement(currentSponsorIndex);
					}, SPONSOR_FADE_DELAY);
				}, SPONSOR_FADE_INTERVAL + SPONSOR_FADE_DELAY);
			});
		}
	}
	customElements.define(RtaijOverlay.is, RtaijOverlay);
})();
