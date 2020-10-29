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
import {background} from '../images/background';
import {Ruler} from '../components/lib/ruler';

const {onsite, hasSponsor} = nodecg.bundleConfig;

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		97px 0px,
		97px 165px,
		97px 735px,
		952px 735px,
		952px 165px,
		97px 165px,
		97px 0px,
		${onsite &&
				`
		750px 0px,
		750px 750px,
		750px 1065px,
		1170px 1065px,
		1170px 750px,
		750px 750px,
		750px 0px,
		`}
			968px 0px,
		968px 165px,
		968px 735px,
		1823px 735px,
		1823px 165px,
		968px 165px,
		968px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 0;
	height: 180px;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: 0;
	width: ${onsite ? 750 : 1140}px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	right: ${hasSponsor ? 210 : 0}px;
	left: ${onsite ? 1170 : 1143}px;
`;

const StyledRuler = styled(Ruler)`
	${bottomStyle};
	left: 1140px;
	bottom: 15px;
	height: 150px;
	width: 3px;
`;

const infoHeights = {
	primaryHeight: 68 * 1.5,
	secondaryHeight: 38 * 1.5,
};

const runnerStyle = css`
	position: absolute;
	top: 750px;
	width: ${onsite ? 735 : 855}px;
	height: 60px;
`;

const LeftRunner = styled.div`
	${runnerStyle};
	left: ${onsite ? 15 : 97}px;
`;

const RightRunner = styled.div`
	${runnerStyle};
	right: ${onsite ? 15 : 97}px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: 825px;
	right: ${onsite ? 15 : 97}px;
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
		{!onsite && <StyledRuler />}
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>
		<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={180} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('gba2'));
