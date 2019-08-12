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
import {background} from '../images/background';

const {onsite, hasSponsor} = nodecg.bundleConfig;

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		15px 0px,
		15px 225px,
		15px 690px,
		635px 690px,
		635px 225px,
		15px 225px,
		15px 0px,
		650px 0px,
		650px 225px,
		650px 690px,
		1270px 690px,
		1270px 225px,
		650px 225px,
		650px 0px,
		1285px 0px,
		1285px 225px,
		1285px 690px,
		1905px 690px,
		1905px 225px,
		1285px 225px,
		1285px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	height: 240px;
	bottom: 0;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: ${onsite ? 495 : 0}px;
	right: 645px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	left: 1278px;
	right: ${hasSponsor ? 210 : 0}px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
};

const runnerStyle = css`
	position: absolute;
	height: 60px;
`;
const Runner = styled.div`
	${runnerStyle};
	top: ${150 + 75 + 465}px;
	width: 620px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: ${150 + 75 + 465 + 60 + 15}px;
	left: 15px;
	right: 15px;
`;

const StyledRuler = styled(Ruler)`
	${bottomStyle}
	left: ${15 + 480 + 30 + 720 + 30}px;
	bottom: 15px;
	width: 3px;
	height: ${225 - 30}px;
`;

const App = () => (
	<StyledContainer>
		<Runner style={{left: '15px'}}>
			<RtaijRunner
				index={0}
				hideLabel
				showFinishTime
				gradientBackground
			/>
		</Runner>
		<Runner style={{left: `${15 + 620 + 15}px`}}>
			<RtaijRunner
				index={1}
				hideLabel
				showFinishTime
				gradientBackground
			/>
		</Runner>
		<Runner style={{right: '15px'}}>
			<RtaijRunner
				index={2}
				hideLabel
				showFinishTime
				gradientBackground
			/>
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
		<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={240} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd3'));
