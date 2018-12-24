import '../styles/common.css';

import React from 'react';
import ReactDom from 'react-dom';
import styled, {css} from 'styled-components';
import {Ruler} from '../components/lib/ruler';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import background from '../images/background.png';

const StyledContainer = styled(Container)`
	background-image: url(${background});
`;

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 15px;
	height: 165px;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: 0;
	width: 1110px;
`;

const BottomSeparator = styled(Ruler)`
	${bottomStyle};
	left: ${30 + 1050 + 30}px;
	height: 150px;
	width: 3px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	right: 210px;
	width: 597px;
`;

const infoHeights = {
	primaryHeight: 68 * 1.5,
	secondaryHeight: 38 * 1.5,
};

const gameAreaStyle = css`
	position: absolute;
	top: ${112 * 1.5}px;
	width: ${504 * 1.5}px;
	height: ${378 * 1.5}px;
	background-color: black;
`;

const LeftGame = styled.div`
	${gameAreaStyle};
	left: ${94 * 1.5}px;
`;

const RightGame = styled.div`
	${gameAreaStyle};
	right: ${94 * 1.5}px;
`;

const runnerStyle = css`
	position: absolute;
	top: ${(100 + 12 + 378) * 1.5}px;
	width: ${504 * 1.5}px;
	height: 60px;
`;
const LeftRunner = styled.div`
	${runnerStyle};
	left: ${94 * 1.5}px;
`;

const RightRunner = styled.div`
	${runnerStyle};
	right: ${94 * 1.5}px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: ${(100 + 12 + 378 + 40 + 15) * 1.5}px;
	left: ${94 * 1.5}px;
	right: ${94 * 1.5}px;
	width: auto;
`;

const App = () => (
	<StyledContainer>
		<LeftRunner>
			<RtaijRunner index={0} showFinishTime gradientBackground />
		</LeftRunner>
		<RightRunner>
			<RtaijRunner index={1} showFinishTime gradientBackground />
		</RightRunner>
		<CommentatorContainer>
			<RtaijCommentator index={0} gradientBackground />
		</CommentatorContainer>
		<GameContainer>
			<RtaijGame {...infoHeights} />
		</GameContainer>
		<BottomSeparator />
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>
		<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={180} />
		<LeftGame />
		<RightGame />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd2'));
