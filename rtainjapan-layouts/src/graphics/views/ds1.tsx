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
import background from '../images/background.png';

const StyledContainer = Container.extend`
	background-image: url(${background});
`;

const runnerStyle = css`
	position: absolute;
	left: ${72 * 1.5}px;
	width: ${(450 + 10 + 675) * 1.5}px;
	height: 60px;
`;
const RunnerContainer = styled.div`
	${runnerStyle};
	bottom: ${(150 + 10 + 40 + 10) * 1.5}px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	bottom: ${(150 + 10) * 1.5}px;
`;

const infoStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 15px;
	height: ${(150 - 10) * 1.5}px;
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
	height: ${(150 - 10 - 10) * 1.5}px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
	thickRuler: true,
};

const gameStyle = css`
	position: absolute;
	bottom: ${(10 + 40 + 10 + 40 + 10 + 150) * 1.5}px;
	background-color: black;
`;

const LeftGame = styled.div`
	${gameStyle};
	left: ${72 * 1.5}px;
	width: ${450 * 1.5}px;
	height: ${300 * 1.5}px;
`;

const RightGame = styled.div`
	${gameStyle};
	right: ${73 * 1.5}px;
	width: ${675 * 1.5}px;
	height: ${450 * 1.5}px;
`;

const App = () => (
	<StyledContainer>
		<RunnerContainer>
			<RtaijRunner index={0} gradientBackground />
		</RunnerContainer>

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
			bottomHeightPx={150 * 1.5}
			TweetProps={{hideLogo: true, widthPx: 422 * 1.5, maxHeightPx: 240}}
		/>
		<LeftGame />
		<RightGame />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('ds1'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
