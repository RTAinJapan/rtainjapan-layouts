import "../styles/global";

import Button from "@mui/material/Button";
import {useReplicant} from "../../use-replicant";
import {FC} from "react";
import {render} from "../../render";

const spotifyConfig = nodecg.bundleConfig.spotify;

const App: FC = () => {
	const spotify = useReplicant("spotify");

	const login = async () => {
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

	return (
		<div>
			{spotify?.currentTrack && <div>再生中: {spotify.currentTrack.name}</div>}
			<Button variant='contained' onClick={login}>
				ログイン
			</Button>
		</div>
	);
};

render(<App />);
