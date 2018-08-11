import React from 'react';
import ReactDom from 'react-dom';
import styled, {css} from 'styled-components';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {Container} from '../components/lib/styled';
import background from '../images/background.png';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijTimer} from '../components/rtaij-timer';
import {Ruler} from '../components/lib/ruler';

const StyledContainer = Container.extend`
	background-image: url(${background});
`;

const NameContainer = styled.div`
	position: absolute;
	left: 15px;
	height: 90px;
	width: 432px;
	display: grid;
`;

const RunnerContainer = NameContainer.extend`
	bottom: 459px;
`;

const CommentatorContainer = NameContainer.extend`
	bottom: 354px;
`;

const infoStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 15px;
	height: 210px;
	display: grid;
`;

const GameContainer = styled.div`
	${infoStyle};
	left: 0;
	width: 1110px;
`;

const TimerContainer = styled.div`
	${infoStyle};
	right: 210px;
	width: 597px;
`;

const StyledRuler = Ruler.extend`
	${infoStyle};
	left: 1110px;
	width: 3px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
	thickRuler: true,
};

const GameArea = styled.div`
	position: absolute;
	top: 15px;
	left: ${(10 + 288 + 10) * 1.5}px;
	width: ${960 * 1.5}px;
	height: ${540 * 1.5}px;
	background-color: black;
`;

const App = () => (
	<StyledContainer>
		<RunnerContainer>
			<RtaijRunner index={0} gradientBackground columnDirection />
		</RunnerContainer>
		<CommentatorContainer>
			<RtaijCommentator gradientBackground columnDirection />
		</CommentatorContainer>

		<GameContainer>
			<RtaijGame {...infoHeights} />
		</GameContainer>
		<StyledRuler />
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>

		<RtaijOverlay
			bottomHeightPx={240}
			TweetProps={{leftAttached: true, widthPx: (10 + 288) * 1.5}}
		/>

		<GameArea />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('hd1'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
