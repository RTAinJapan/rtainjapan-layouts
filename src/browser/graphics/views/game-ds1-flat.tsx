import "../styles/common.css";

import ReactDOM from "react-dom";
import styled, {css} from "styled-components";
import {Ruler} from "../components/lib/ruler";
import {Container} from "../components/lib/styled";
import {RtaijCommentator} from "../components/rtaij-commentator";
import {RtaijGame} from "../components/rtaij-game";
import {RtaijOverlay} from "../components/rtaij-overlay";
import {RtaijRunner} from "../components/rtaij-runner";
import {RtaijTimer} from "../components/rtaij-timer";
import {background} from "../images/background";

const StyledContainer = styled(Container)`
	clip-path: polygon(
		0px 0px,
		15px 0px,
		15px 705px,
		15px 1065px,
		495px 1065px,
		495px 705px,
		15px 705px,
		15px 0px,
		252px 0px,
		252px 165px,
		252px 690px,
		952px 690px,
		952px 165px,
		252px 165px,
		252px 0px,
		968px 0px,
		968px 165px,
		968px 690px,
		1668px 690px,
		1668px 165px,
		968px 165px,
		968px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	height: 225px;
	bottom: 0;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: 495px;
	width: 780px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	right: 210px;
	width: 432px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
};

const runnerStyle = css`
	position: absolute;
	left: ${15 + 480}px;
	right: 15px;
	width: auto;
	height: 60px;
`;
const Runner = styled.div`
	${runnerStyle};
	top: ${15 + 675 + 15}px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: ${15 + 675 + 15 + 60 + 15}px;
`;

const StyledRuler = styled(Ruler)`
	${bottomStyle}
	left: ${15 + 480 + 30 + 720 + 30}px;
	bottom: 15px;
	width: 3px;
	height: ${225 - 30}px;
`;

// TODO: game/timer boxes are overwrapping when with camera
const App = () => (
	<StyledContainer backgroundImage={background} clipBoxes={[]}>
		<Runner>
			<RtaijRunner index={0} showFinishTime gradientBackground />
		</Runner>
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
		<RtaijOverlay bottomHeightPx={225} TweetProps={{rowDirection: true}} />
	</StyledContainer>
);

ReactDOM.render(<App />, document.getElementById("root"));
