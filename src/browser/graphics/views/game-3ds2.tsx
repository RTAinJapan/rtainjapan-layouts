import '../styles/common.css';

import React from 'react';
import ReactDOM from 'react-dom';
import styled, {css} from 'styled-components';
import {Ruler} from '../components/lib/ruler';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import {background} from '../images/background';
import {Box} from '../clip-path-calculator';

const {hasSponsor} = nodecg.bundleConfig;

const gameBoxes: Box[] = [
	[105, 105 + 850, 150 + 15, 150 + 15 + 510],
	[105 + 850 + 15, 105 + 850 + 15 + 850, 150 + 15, 150 + 15 + 510],
	[
		15 + 625 + 15,
		15 + 625 + 15 + 300,
		150 + 15 + 510 + 15,
		150 + 15 + 510 + 15 + 225,
	],
	[
		1920 - 100 - 300,
		1920 - 100,
		150 + 15 + 510 + 15,
		150 + 15 + 510 + 15 + 225,
	],
];

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	height: 150px;
	bottom: 0;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: 30px;
	right: ${30 + 3 + 30 + 537 + 30 + 210}px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	left: ${30 + 1050 + 30 + 3 + 30}px;
	right: ${hasSponsor ? 30 + 210 : 30}px;
`;

const infoHeights = {
	primaryHeight: 90,
	secondaryHeight: 60,
};

const runnerStyle = css`
	position: absolute;
	height: 90px;
`;
const Runner = styled.div`
	${runnerStyle};
	top: ${150 + 15 + 510 + 15}px;
	width: 550px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	bottom: ${150 + 15}px;
	left: 15px;
	width: 625px;
	height: 60px;
`;

const StyledRuler = styled(Ruler)`
	${bottomStyle}
	left: ${30 + 1050 + 30}px;
	bottom: 15px;
	width: 3px;
	height: 120px;
`;

const App = () => (
	<Container clipBoxes={gameBoxes} backgroundImage={background}>
		<Runner style={{left: '105px'}}>
			<RtaijRunner index={0} hideLabel gradientBackground columnDirection />
		</Runner>
		<Runner style={{left: `${105 + 850 + 15}px`}}>
			<RtaijRunner index={1} hideLabel gradientBackground columnDirection />
		</Runner>
		<CommentatorContainer>
			<RtaijCommentator index={0} gradientBackground />
		</CommentatorContainer>
		<GameContainer>
			<RtaijGame {...infoHeights} />
		</GameContainer>
		<StyledRuler />
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>
		<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={150} />
	</Container>
);

ReactDOM.render(<App />, document.getElementById('root'));
