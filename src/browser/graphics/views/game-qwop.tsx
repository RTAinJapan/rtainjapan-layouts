import '../styles/common.css';

import React from 'react';
import ReactDOM from 'react-dom';
import styled, {css} from 'styled-components';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import {background} from '../images/background';

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		0px 1065px,
		16px 1065px,
		16px 686px,
		688px 686px,
		688px 1065px,
		0px 1065px,
		0px 1080px,
		704px 1080px,
		704px 165px,
		1904px 165px,
		1904px 915px,
		704px 915px,
		704px 1080px,
		1920px 1080px,
		1920px 0px,
		0px 0px
	);
`;

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0px;
	height: 536px;
	width: 704px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 20px;
`;

const participantStyle = css`
	position: absolute;
	left: 688px;
	right: 16px;
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
		<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={150} />
	</StyledContainer>
);

ReactDOM.render(<App />, document.getElementById('root'));
