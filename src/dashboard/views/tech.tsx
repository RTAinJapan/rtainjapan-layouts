import '../../lib/react-devtools';

// Packages
import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

// Ours
import {Checklist} from '../components/checklist';
import {Schedule} from '../components/schedule';
import {Timekeeper} from '../components/timekeeper';
import {Twitter} from '../components/twitter';
import {twitterCallback} from '../lib/twitter-callback';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const Container = styled.div`
	height: 100vh;
	width: 100vw;
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

const LeftColumn = Column.extend`
	height: calc(100vh - 32px);
	grid-template-rows: 1fr auto;
`;

const appTheme = createMuiTheme({
	props: {
		MuiButton: {
			variant: 'raised',
		},
	},
});

export const App = () => (
	<MuiThemeProvider theme={appTheme}>
		<Container>
			<LeftColumn>
				<Timekeeper />
				<Checklist />
			</LeftColumn>
			<Column>
				<Schedule />
			</Column>
			<Column>
				<Twitter />
			</Column>
		</Container>
	</MuiThemeProvider>
);

twitterCallback();

document.body.style.margin = '0';
document.body.style.padding = '0';

ReactDom.render(<App />, document.getElementById('tech'));
