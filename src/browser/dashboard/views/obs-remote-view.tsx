import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {RemoteEdit} from '../components/obs/remote-edit';

interface State {
	connected: boolean;
	remoteInputs: {
		input: string | null;
		viewId: string;
	}[];
	browsers: string[];
}

const Container = styled.div`
	display: grid;
	grid-gap: 8px;
`;

class App extends React.Component<{}, State> {
	state: State = {
		connected: false,
		remoteInputs: [],
		browsers: [],
	};
	private readonly obsRep = nodecg.Replicant('obs');
	private readonly obsRemoteInputsRep = nodecg.Replicant('obs-remote-inputs');

	componentDidMount() {
		this.obsRep.on('change', (newVal) => {
			if (!newVal) {
				return;
			}

			const browsers = newVal.scenes.flatMap((scene) =>
				scene.sources
					.filter((source) => source.type === 'browser_source')
					.map((source) => source.name),
			);

			this.setState({
				connected: newVal.connected,
				browsers: browsers.filter((browser, index) => {
					return browsers.indexOf(browser) === index;
				}),
			});
		});

		this.obsRemoteInputsRep.on('change', (newVal) => {
			if (!newVal) {
				return;
			}

			this.setState({
				remoteInputs: newVal,
			});
		});
	}
	componentWillUnmount() {
		this.obsRemoteInputsRep.removeAllListeners('change');
	}

	public render() {
		return (
			<div style={{height: '640px'}}>
				{this.state.connected ? (
					<Container>
						{this.state.remoteInputs.map((remote, rIndex) => (
							<RemoteEdit
								key={rIndex}
								browsers={this.state.browsers}
								browserIndex={rIndex}
								repBrowser={remote.input || ''}
								repViewId={remote.viewId}
							></RemoteEdit>
						))}
					</Container>
				) : (
					<p>OBSに接続されていません。</p>
				)}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
