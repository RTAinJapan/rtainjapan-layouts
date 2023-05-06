import "../styles/global";

import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import styled from "styled-components";
import {Checklist} from "../components/checklist";
import {Schedule} from "../components/schedule";
import {Timekeeper} from "../components/timekeeper";
import {render} from "../../render";

const Container = styled.div`
	color: #000;
	height: 100vh;
	width: 100vw;
	padding: 16px;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 20px;
`;

const Column = styled.div`
	display: grid;
	grid-gap: 16px;
`;

const LeftColumn = styled(Column)`
	height: calc(100vh - 32px);
	grid-template-rows: 1fr auto;
`;

const appTheme = createTheme({
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
			},
		},
	},
});

const App = () => (
	<ThemeProvider theme={appTheme}>
		<Container>
			<LeftColumn>
				<Timekeeper />
				<Checklist />
			</LeftColumn>
			<Column>
				<Schedule />
			</Column>
		</Container>
	</ThemeProvider>
);

const twitterCallback = localStorage.getItem("twitter-callback");
localStorage.removeItem("twitter-callback");
if (twitterCallback) {
	const params = new URLSearchParams(twitterCallback);
	nodecg.sendMessage("twitter:loginSuccess", {
		oauthToken: params.get("oauth_token"),
		oauthVerifier: params.get("oauth_verifier"),
	});
}

const spotifyCallback = localStorage.getItem("spotify-callback");
localStorage.removeItem("spotify-callback");
if (spotifyCallback) {
	const params = new URLSearchParams(spotifyCallback);
	if (params.get("error")) {
		nodecg.log.error("Error after spotify callback");
	} else {
		const code = params.get("code");
		nodecg.sendMessage("spotify:authenticated", {code});
	}
}

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
