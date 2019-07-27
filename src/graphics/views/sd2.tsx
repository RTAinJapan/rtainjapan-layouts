import '../styles/common.css';

import React from 'react';
import ReactDom from 'react-dom';
import styled, {css} from 'styled-components';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import background from '../images/background.png';

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		141px 0px,
		141px 168px,
		141px 735px,
		897px 735px,
		897px 168px,
		141px 168px,
		141px 0px,
		750px 0px,
		750px 750px,
		750px 1065px,
		1170px 1065px,
		1170px 750px,
		750px 750px,
		750px 0px,
		1023px 0px,
		1023px 168px,
		1023px 735px,
		1779px 735px,
		1779px 168px,
		1023px 168px,
		1023px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
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
	width: ${(20 + 460 + 20) * 1.5}px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	right: 210px;
	width: 540px;
`;

const infoHeights = {
	primaryHeight: 68 * 1.5,
	secondaryHeight: 38 * 1.5,
};

const runnerStyle = css`
	position: absolute;
	top: ${(100 + 12 + 378 + 10) * 1.5}px;
	width: ${490 * 1.5}px;
	height: 60px;
`;
const LeftRunner = styled.div`
	${runnerStyle};
	left: 15px;
`;

const RightRunner = styled.div`
	${runnerStyle};
	right: 15px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: ${(100 + 12 + 378 + 10 + 40 + 10) * 1.5}px;
	left: ${(20 + 460 + 20 + 280) * 1.5}px;
	right: 15px;
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
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>
		<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={180} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd2'));
