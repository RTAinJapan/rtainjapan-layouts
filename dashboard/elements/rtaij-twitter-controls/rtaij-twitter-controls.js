const tweets = nodecg.Replicant('tweets');

class RtaijTwitterControls extends Polymer.MutableData(Polymer.Element) {
	static get is() {
		return 'rtaij-twitter-controls';
	}

	static get properties() {
		return {};
	}

	ready() {
		super.ready();

		tweets.on('change', newVal => {
			this.$.empty.style.display = newVal.length > 0 ? 'none' : 'flex';
			this.tweets = newVal;
			// TODO
			console.log(newVal);
		});
	}

	sortTweets(a, b) {
		return new Date(b.created_at) - new Date(a.created_at);
	}
}

customElements.define(RtaijTwitterControls.is, RtaijTwitterControls);
