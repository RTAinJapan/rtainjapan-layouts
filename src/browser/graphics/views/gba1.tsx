import '../styles/common.css';

import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
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
		54px 0px,
		54px 686px,
		54px 1065px,
		726px 1065px,
		726px 686px,
		54px 686px,
		54px 0px,
		`}
			741px 0px,
		741px 165px,
		741px 915px,
		1851px 915px,
		1851px 165px,
		741px 165px,
		741px 0px,
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
	height: 536px;
	width: ${54 + 672}px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 20px;
`;

const RunnerContainer = styled.div`
	position: absolute;
	bottom: 75px;
	left: ${onsite ? 54 + 672 : 30}px;
	right: ${hasSponsor ? 240 : 30}px;
	height: 60px;
`;

const CommentatorContainer = styled(RunnerContainer)`
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

ReactDom.render(<App />, document.getElementById('gba1'));
