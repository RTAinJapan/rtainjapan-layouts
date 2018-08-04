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
	clip-path: polygon(
		0 0,
		0 225px,
		1905px 225px,
		1905px 690px,
		1285px 690px,
		1285px 225px,
		1270px 225px,
		1270px 690px,
		650px 690px,
		650px 225px,
		635px 225px,
		635px 690px,
		15px 690px,
		15px 225px,
		0px 225px,
		0px 1080px,
		1920px 1080px,
		1920px 0px,
		0px 0px
	);
`;

const runnerStyle = css`
	position: absolute;
	bottom: 330px
	height: 60px;
	width: 620px;
	display: grid;
`
const LeftRunner = styled.div`
	${runnerStyle}
	left: 15px;
`;

const CentreRunner = styled.div`
	${runnerStyle}
	left: 650px;
`;

const RightRunner = styled.div`
	${runnerStyle}
	right: 15px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle}
	bottom: 255px;
	left: 15px;
	width: 1890px;
`;

const infoStyle = css`
	position: absolute;
	bottom: 15px;
	height: 210px;
	display: grid;
`

const GameContainer = styled.div`
	${infoStyle}
	left: 0;
	width: 1110px;
`;

const TimerContainer = styled.div`
	${infoStyle}
	right: 210px;
	width: 597px;
`;

const StyledRuler = Ruler.extend`
	position: absolute;
	bottom: 15px;
	left: 1110px;
	height: 210px;
	width: 3px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
	thickRuler: true,
};

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

		<RtaijOverlay bottomHeightPx={240} />
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('sd3'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
