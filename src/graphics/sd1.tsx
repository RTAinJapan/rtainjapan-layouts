import React from 'react';
import ReactDom from 'react-dom';
import styled, {css} from 'styled-components';
import {RtaijTimer} from './components/rtaij-timer';
import {RtaijGame} from './components/rtaij-game';
import {RtaijRunner} from './components/rtaij-runner';
import {RtaijCommentator} from './components/rtaij-commentator';
import {RtaijOverlay} from './components/rtaij-overlay';
import {Container} from './lib/styled';

const StyledContainer = Container.extend`
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

	#runner,
	#commentator {
		height: 60px;
		width: 993px;
		left: 687px;
		background: none;
	}

	#runner {
		bottom: 75px;
	}

	#commentator {
		bottom: 15px;
	}
`;

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0;
	height: 537px;
	width: 705px;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: stretch;
`;

const gameTimeStyle = css`
	margin: 10px 0 10px 0;
	/* TODO */
	height: 150px;
	width: auto;
	z-index: 1;
`;
const StyledRtaijGame = styled(RtaijGame)`
	${gameTimeStyle};
	background: linear-gradient(
		to right,
		rgba(2, 14, 21, 0.05) 0%,
		rgba(2, 14, 21, 0.6) 45%,
		rgba(2, 14, 21, 0.6) 55%,
		rgba(2, 14, 21, 0.05) 100%
	);
`;
const StyledRtaijTimer = styled(RtaijTimer)`
	${gameTimeStyle};
`;

const App = () => (
	<StyledContainer>
		<InfoContainer>
			<StyledRtaijGame titleHeight="102px" miscHeight="57px" />
			<StyledRtaijTimer timerHeight="102px" estHeight="57px" />
		</InfoContainer>
		<RtaijRunner />
		<RtaijCommentator />
		<RtaijOverlay bottomHeightPx={150} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd1'));
