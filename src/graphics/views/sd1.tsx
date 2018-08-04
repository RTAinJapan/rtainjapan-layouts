import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import {RtaijTimer} from '../components/rtaij-timer';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {Container} from '../components/lib/styled';
import background from '../images/background.png';

const StyledContainer = Container.extend`
	background-image: url(${background});
	clip-path: polygon(
		0 0,
		0 1080px,
		15px 1080px,
		15px 687px,
		687px 687px,
		687px 1065px,
		15px 1065px,
		15px 1080px,
		1920px 1080px,
		1920px 0,
		1905px 0,
		1905px 915px,
		705px 915px,
		705px 15px,
		1905px 15px,
		1905px 0
	);
`;

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0px;
	height: 537px;
	width: ${() => 470 * 1.5}px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	gap: 30px;
`;

const RunnerContainer = styled.div`
	position: absolute;
	bottom: 15px;
	left: 687px;
	height: 120px;
	width: ${662 * 1.5}px;

	display: grid;
	grid-template-rows: auto auto;
	grid-template-rows: 1fr 1fr;
	align-content: stretch;
	justify-content: stretch;
`;

const App = () => (
	<StyledContainer>
		<InfoContainer>
			<RtaijGame gradientBackground />
			<RtaijTimer gradientBackground />
		</InfoContainer>
		<RunnerContainer>
			<RtaijRunner />
			<RtaijCommentator />
		</RunnerContainer>
		<RtaijOverlay bottomHeightPx={150} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd1'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
