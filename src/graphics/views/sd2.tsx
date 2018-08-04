import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {Container} from '../components/lib/styled';
import background from '../images/background.png';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijTimer} from '../components/rtaij-timer';

const StyledContainer = Container.extend`
	background-image: url(${background});
	clip-path: polygon(
		0 0,
		0 1080px,
		141px 1080px,
		141px 168px,
		897px 168px,
		897px 735px,
		141px 735px,
		141px 1080px,
		750px 1080px,
		750px 750px,
		1170px 750px,
		1170px 1065px,
		750px 1065px,
		750px 1080px,
		1920px 1080px,
		1920px 735px,
		1023px 735px,
		1023px 168px,
		1779px 168px,
		1779px 735px,
		1920px 735px,
		1920px 0
	);
`;

const LeftRunner = styled.div`
	position: absolute;
	left: 15px;
	top: 750px;
	height: 60px;
	width: 735px;

	display: grid;
`;

const RightRunner = styled.div`
	position: absolute;
	right: 15px;
	top: 750px;
	height: 135px;
	width: 735px;

	display: grid;
	grid-template-rows: 1fr 1fr;
	gap: 15px;
`;

const GameContainer = styled.div`
	position: absolute;
	bottom: 15px;
	height: 165px;
	width: ${500 * 1.5}px;

	display: grid;
`;

const TimerContainer = styled.div`
	position: absolute;
	bottom: 15px;
	right: ${140 * 1.5}px;
	height: 165px;
	width: ${360 * 1.5}px;

	display: grid;
`;

const infoHeights = {
	primaryHeight: 68 * 1.5,
	secondaryHeight: 38 * 1.5,
};

const App = () => (
	<StyledContainer>
		<LeftRunner>
			<RtaijRunner index={0} gradientBackground />
		</LeftRunner>
		<RightRunner>
			<RtaijRunner index={1} gradientBackground />
			<RtaijCommentator gradientBackground />
		</RightRunner>
		<GameContainer>
			<RtaijGame {...infoHeights} />
		</GameContainer>
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>
		<RtaijOverlay bottomHeightPx={180} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd2'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 500);
});
