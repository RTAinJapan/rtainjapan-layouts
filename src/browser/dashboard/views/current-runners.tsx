import React from 'react';
import ReactDOM from 'react-dom';
import {Participant} from '../../../nodecg/replicants';

interface State {
	runners: Participant[];
}
class App extends React.Component<{}, State> {
	private readonly currentRunRep = nodecg.Replicant('current-run');
	state: State = {runners: []};

	componentDidMount() {
		this.currentRunRep.on('change', (newVal) => {
			if (!newVal) {
				return;
			}
			this.setState({runners: newVal.runners});
		});
	}
	componentWillUnmount() {
		this.currentRunRep.removeAllListeners('change');
	}

	render() {
		return (
			<div>
				<div>
					走者0: {this.state.runners[0] && this.state.runners[0].name}
				</div>
				<div>
					走者1: {this.state.runners[1] && this.state.runners[1].name}
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('current-runners'));
