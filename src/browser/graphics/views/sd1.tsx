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

const {onsite, hasSponsor} = nodecg.bundleConfig;

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		${onsite &&
				`
		15px 0px,
		15px 687px,
		15px 1065px,
		687px 1065px,
		687px 687px,
		15px 687px,
		15px 0px,
		`}
			705px 0px,
		705px 15px,
		705px 915px,
		1905px 915px,
		1905px 15px,
		705px 15px,
		705px 0px,
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
	height: 537px;
	width: ${470 * 1.5}px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 20px;
`;

const participantStyle = css`
	position: absolute;
	left: ${onsite ? 687 : 30}px;
	right: ${hasSponsor ? 240 : 30}px;
	height: 60px;
`;

const RunnerContainer = styled.div`
	${participantStyle}
	bottom: 75px;
`;

const CommentatorContainer = styled.div`
	${participantStyle}
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
			TweetProps={{widthPx: 360 * 1.5, hideLogo: true}}
			bottomHeightPx={150}
		/>
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd1'));
