import React from 'react';
import ReactDOM from 'react-dom';
import {ObsConnect} from '../components/obs/connect';

const obsConfig = nodecg.bundleConfig.obs;

interface State {
	connected: boolean;
}

class App extends React.Component<{}, State> {
	state: State = {
		connected: false,
	};
	private readonly obsRep = nodecg.Replicant('obs');

	componentDidMount() {
		this.obsRep.on('change', (newVal) => {
			if (!newVal) {
				return;
			}

			this.setState({
				connected: newVal.connected,
			});
		});
	}
	componentWillUnmount() {
		this.obsRep.removeAllListeners('change');
	}

	public render() {
		return (
			<div>
				{obsConfig && (
					<ObsConnect
						obsConfig={obsConfig}
						connected={this.state.connected}
					></ObsConnect>
				)}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
