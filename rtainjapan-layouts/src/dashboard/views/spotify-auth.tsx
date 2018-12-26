import Button from '@material-ui/core/Button';
import React from 'react';
import ReactDom from 'react-dom';
import BundleConfig from '../../bundle-config';
import {ReplicantName as R, Spotify} from '../../replicants';

const spotifyConfig = (nodecg.bundleConfig as BundleConfig).spotify;

interface State {
	currentTrack?: {
		name: string;
		artists: string;
	};
}

class App extends React.Component<{}, State> {
	state: State = {};
	private readonly spotifyRep = nodecg.Replicant<Spotify>(R.Spotify);

	componentDidMount() {
		this.spotifyRep.on('change', (newVal) => {
			if (!newVal.currentTrack) {
				return;
			}
			this.setState({currentTrack: newVal.currentTrack});
		});
	}
	componentWillUnmount() {
		this.spotifyRep.removeAllListeners();
	}

	public render() {
		return this.state.currentTrack ? (
			<div>再生中: {this.state.currentTrack.name}</div>
		) : (
			<Button onClick={this.login}>ログイン</Button>
		);
	}

	private readonly login = async () => {
		const redirectUrl: string = await nodecg.sendMessage('spotify:login');
		const url = new URL('authorize', 'https://accounts.spotify.com');
		url.searchParams.set('client_id', spotifyConfig.clientId);
		url.searchParams.set('response_type', 'code');
		url.searchParams.set('redirect_uri', redirectUrl);
		url.searchParams.set('scope', 'user-read-currently-playing');
		window.parent.location.replace(url.href);
	};
}

ReactDom.render(<App />, document.getElementById('spotify-auth'));
