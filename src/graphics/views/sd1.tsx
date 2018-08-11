import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import {RtaijTimer} from '../components/rtaij-timer';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {Container} from '../components/lib/styled';
import background from '../images/background.png';

const StyledContainer = Container.extend`
	background-image: url(${background});
`;

const GameArea = styled.div`
	position: absolute;
	top: 15px;
	right: 15px;
	width: ${800 * 1.5}px;
	height: ${600 * 1.5}px;
	background-color: black;
`;

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0px;
	height: 537px;
	width: ${() => 470 * 1.5}px;

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
			<RtaijRunner />
		</RunnerContainer>
		<CommentatorContainer>
			<RtaijCommentator />
		</CommentatorContainer>
		<RtaijOverlay
			TweetProps={{widthPx: 360 * 1.5, hideLogo: true}}
			bottomHeightPx={150}
		/>
		<GameArea />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd1'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
