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

const runnerStyle = css`
	position: absolute;
	bottom: 330px
	height: 60px;
	width: 620px;
`;
const LeftRunner = styled.div`
	${runnerStyle};
	left: 15px;
`;

const CentreRunner = styled.div`
	${runnerStyle};
	left: 650px;
`;

const RightRunner = styled.div`
	${runnerStyle};
	right: 15px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	bottom: 255px;
	left: 15px;
	width: 1890px;
`;

const infoStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 15px;
	height: 210px;
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

const gameStyle = css`
	position: absolute;
	width: 620px;
	height: 465px;
	top: 225px;
	background-color: black;
`;

const LeftGame = styled.div`
	${gameStyle};
	left: 15px;
`;

const CentreGame = styled.div`
	${gameStyle};
	left: ${15 + 620 + 15}px;
`;

const RightGame = styled.div`
	${gameStyle};
	right: 15px;
`;

const App = () => (
	<StyledContainer>
		<LeftRunner>
			<RtaijRunner index={0} gradientBackground />
		</LeftRunner>
		<CentreRunner>
			<RtaijRunner index={1} gradientBackground />
		</CentreRunner>
		<RightRunner>
			<RtaijRunner index={2} gradientBackground />
		</RightRunner>

		<CommentatorContainer>
			<RtaijCommentator gradientBackground />
		</CommentatorContainer>

		<GameContainer>
			<RtaijGame {...infoHeights} />
		</GameContainer>
		<StyledRuler />
		<TimerContainer>
			<RtaijTimer {...infoHeights} />
		</TimerContainer>

		<RtaijOverlay bottomHeightPx={240} TweetProps={{rowDirection: true}} />

		<LeftGame />
		<CentreGame />
		<RightGame />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd3'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
