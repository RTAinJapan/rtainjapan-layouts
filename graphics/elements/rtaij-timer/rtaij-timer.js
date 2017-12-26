(function () {
	const currentRun = nodecg.Replicant('currentRun');
	const stopwatch = nodecg.Replicant('stopwatch');

	class RtaijTimer extends Polymer.Element {
		static get is() {
			return 'rtaij-timer';
		}

		ready() {
			super.ready();

			currentRun.on('change', newVal => {
				this.est = newVal.estimated || newVal.title[0];
			});

			stopwatch.on('change', newVal => {
				this.time = newVal.formatted;

				switch (newVal.state) {
					case 'stopped':
						this.$.timer.style.color = '#9a9fa1';
						break;
					case 'running':
						this.$.timer.style.color = '#ffffff';
						break;
					case 'finished':
						this.$.timer.style.color = '#ffff52';
						break;
					default:
						break;
				}
			});
		}
	}
	customElements.define(RtaijTimer.is, RtaijTimer);
})();
