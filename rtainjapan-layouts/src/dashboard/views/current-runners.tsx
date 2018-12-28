import React from 'react';
import ReactDOM from 'react-dom';
import {CurrentRun, ReplicantName, Runner} from '../../replicants';

interface State {
	runners: Runner[];
}
class App extends React.Component<{}, State> {
	private readonly currentRunRep = nodecg.Replicant<CurrentRun>(
		ReplicantName.CurrentRun,
	);
	state: State = {runners: []};

	componentDidMount() {
		this.currentRunRep.on('change', (newVal) => {
			this.setState({runners: newVal.runners});
		});
	}
	componentWillUnmount() {
		this.currentRunRep.removeAllListeners();
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
