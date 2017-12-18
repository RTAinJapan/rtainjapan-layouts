class RtaijScheduleRuninfo extends Polymer.Element {
	static get is() {
		return 'rtaij-schedule-runinfo';
	}

	static get properties() {
		return {
			notes: {
				type: String,
				observer: '_notesChanged'
			},
			label: {
				type: String,
				reflectToAttribute: true
			}
		};
	}

	_notesChanged(newVal) {
		if (newVal) {
			this.$.notes.querySelector('.value').innerHTML =
				newVal.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
		} else {
			this.$.notes.querySelector('.value').innerHTML = '';
		}
	}

	setRun(run) {
		this.title = run.title;
		this.hardware = run.hardware;
		this.runners = run.runners;
		this.commentators = run.commentators;
		this.category = run.category;
		this.index = run.index;
		this.notes = run.notes;
	}

	calcName(name) {
		if (name) {
			return name.split('\\n').join(' ');
		}
		return name;
	}
}

customElements.define(RtaijScheduleRuninfo.is, RtaijScheduleRuninfo);
