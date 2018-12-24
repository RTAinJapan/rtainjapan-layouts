import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
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

const GameArea = styled.div`
	position: absolute;
	top: 24px;
	right: 90px;
	width: ${660 * 1.5}px;
	height: ${594 * 1.5}px;
	background-color: black;
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

const RunnerContainer = styled.div`
	position: absolute;
	bottom: 75px;
	left: 30px;
	right: ${160 * 1.5}px;
	height: 60px;
`;

const CommentatorContainer = styled.div`
	position: absolute;
	bottom: 15px;
	left: 30px;
	right: ${160 * 1.5}px;
	height: 60px;
`;

const App = () => (
	<StyledContainer>
		<InfoContainer>
			<RtaijGame gradientBackground />
			<RtaijTimer gradientBackground />
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
		<GameArea />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('gb1'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
