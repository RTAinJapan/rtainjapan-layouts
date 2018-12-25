import '../styles/common.css';

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

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		15px 0px,
		15px 741px,
		15px 1065px,
		447px 1065px,
		447px 741px,
		15px 741px,
		15px 0px,
		465px 0px,
		465px 15px,
		465px 825px,
		1905px 825px,
		1905px 15px,
		465px 15px,
		465px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const NameContainer = styled.div`
	position: absolute;
	left: 15px;
	height: 90px;
	width: 432px;
	display: grid;
`;

const RunnerContainer = styled(NameContainer)`
	bottom: 459px;
`;

const CommentatorContainer = styled(NameContainer)`
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
	left: 480px;
	width: 765px;
`;

const TimerContainer = styled.div`
	${infoStyle};
	right: 240px;
	width: 372px;
`;

const StyledRuler = styled(Ruler)`
	${infoStyle};
	right: 642px;
	width: 3px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
	thickRuler: true,
};

const App = () => (
	<StyledContainer>
		<RunnerContainer>
			<RtaijRunner index={0} gradientBackground columnDirection />
		</RunnerContainer>
		<CommentatorContainer>
			<RtaijCommentator index={0} gradientBackground columnDirection />
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
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('hd1'));
