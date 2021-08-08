import Button from "@material-ui/core/Button";
import React from "react";
import ReactDOM from "react-dom";

const spotifyConfig = nodecg.bundleConfig.spotify;

interface State {
	currentTrack?: {
		name: string;
		artists: string;
	};
}

class App extends React.Component<{}, State> {
	state: State = {};
	private readonly spotifyRep = nodecg.Replicant("spotify");

	componentDidMount() {
		this.spotifyRep.on("change", (newVal) => {
			if (!newVal) {
				return;
			}
			if (!newVal.currentTrack) {
				return;
			}
			this.setState({
				currentTrack: {
					name: newVal.currentTrack.name || "",
					artists: newVal.currentTrack.artists || "",
				},
			});
		});
	}
	componentWillUnmount() {
		this.spotifyRep.removeAllListeners("change");
	}

	public render() {
		return (
			<div>
				{this.state.currentTrack && (
					<div>再生中: {this.state.currentTrack.name}</div>
				)}
				<Button variant='contained' onClick={this.login}>
					ログイン
				</Button>
			</div>
		);
	}

	private readonly login = async () => {
		if (!spotifyConfig) {
			return;
		}
		const redirectUrl = await nodecg.sendMessage("spotify:login");
		const url = new URL("authorize", "https://accounts.spotify.com");
		url.searchParams.set("client_id", spotifyConfig.clientId);
		url.searchParams.set("response_type", "code");
		url.searchParams.set("redirect_uri", redirectUrl);
		url.searchParams.set("scope", "user-read-currently-playing");
		url.searchParams.set("show_dialog", "false");
		window.parent.location.href = url.href;
	};
}

ReactDOM.render(<App />, document.getElementById("root"));
