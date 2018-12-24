import 'modern-normalize/modern-normalize.css';

import '../../fonts/migmix-2p/index.css';

import '../../shared/react-devtools';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
// import {Checklist} from '../components/checklist';
// import {Schedule} from '../components/schedule';
import {Timekeeper} from '../components/timekeeper';
// import {Twitter} from '../components/twitter';

const Container = styled.div`
	color: #000;
	font-family: 'MigMix 2P';
	height: 100vh;
	width: 1920px;
	padding: 16px;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
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

const appTheme = createMuiTheme({
	typography: {
		fontFamily: 'MigMix 2P',
		useNextVariants: true,
	},
	props: {
		MuiButton: {
			variant: 'contained',
		},
	},
});

export const App = () => (
	<MuiThemeProvider theme={appTheme}>
		<Container>
			<LeftColumn>
				<Timekeeper />
				{/* <Checklist /> */}
			</LeftColumn>
			<Column>{/* <Schedule /> */}</Column>
			<Column>{/* <Twitter /> */}</Column>
		</Container>
	</MuiThemeProvider>
);

const storage = localStorage.getItem('twitter-callback');
localStorage.removeItem('twitter-callback');
if (storage) {
	const params = new URLSearchParams(storage);
	nodecg.sendMessage('twitter:loginSuccess', {
		oauthToken: params.get('oauth_token'),
		oauthVerifier: params.get('oauth_verifier'),
	});
}

ReactDom.render(<App />, document.getElementById('tech'));
