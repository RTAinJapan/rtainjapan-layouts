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

const {onsite} = nodecg.bundleConfig;

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		${onsite &&
				`
		90px 0px,
		90px 687px,
		90px 1065px,
		762px 1065px,
		762px 687px,
		90px 687px,
		90px 0px,
		`}
			840px 0px,
		840px 24px,
		840px 915px,
		1830px 915px,
		1830px 24px,
		840px 24px,
		840px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0px;
	width: ${560 * 1.5}px;
	height: ${358 * 1.5}px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 30px;
`;

const runnerStyle = css`
	position: absolute;
	left: ${(onsite ? 60 + 448 : 10) * 1.5}px;
	right: ${160 * 1.5}px;
	height: 60px;
`;

const RunnerContainer = styled.div`
	${runnerStyle};
	bottom: 75px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	bottom: 15px;
`;

const App = () => (
	<StyledContainer>
		<InfoContainer>
			<RtaijGame gradientBackground primaryHeight={100} />
			<RtaijTimer gradientBackground primaryHeight={100} />
		</InfoContainer>
		<RunnerContainer>
			<RtaijRunner index={0} />
		</RunnerContainer>
		<CommentatorContainer>
			<RtaijCommentator index={0} />
		</CommentatorContainer>
		<RtaijOverlay
			TweetProps={{widthPx: 450 * 1.5, hideLogo: true}}
			bottomHeightPx={150}
		/>
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('gb1'));
