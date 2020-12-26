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
		${onsite &&
				`
		15px 0px,
		15px 705px,
		15px 1065px,
		495px 1065px,
		495px 705px,
		15px 705px,
		15px 0px,
		`}
			90px 0px,
		90px 240px,
		90px 690px,
		690px 690px,
		690px 240px,
		90px 240px,
		90px 0px,
		705px 0px,
		705px 15px,
		705px 690px,
		1830px 690px,
		1830px 15px,
		705px 15px,
		705px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	height: 225px;
	bottom: 0;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: ${onsite ? 495 : 0}px;
	width: 1140px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	left: 1143px;
	right: ${hasSponsor ? 210 : 0}px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
};

const runnerStyle = css`
	position: absolute;
	left: ${onsite ? 15 + 480 : 90}px;
	right: ${onsite ? 15 : 90}px;
	height: 60px;
`;
const Runner = styled.div`
	${runnerStyle};
	top: ${15 + 675 + 15}px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: ${15 + 675 + 15 + 60 + 15}px;
`;

const StyledRuler = styled(Ruler)`
	${bottomStyle}
	left: 1140px;
	bottom: 15px;
	width: 3px;
	height: 195px;
`;

const App = () => (
	<StyledContainer>
		<Runner>
			<RtaijRunner index={0} showFinishTime gradientBackground />
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
		<RtaijOverlay
			TweetProps={{widthPx: 540, hideLogo: true}}
			bottomHeightPx={225}
		/>
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('3ds1'));
