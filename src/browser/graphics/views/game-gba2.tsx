import "../styles/common.css";

import ReactDOM from "react-dom";
import styled, {css} from "styled-components";
import {Container} from "../components/lib/styled";
import {RtaijCommentator} from "../components/rtaij-commentator";
import {RtaijGame} from "../components/rtaij-game";
import {RtaijOverlay} from "../components/rtaij-overlay";
import {RtaijRunner} from "../components/rtaij-runner";
import {RtaijTimer} from "../components/rtaij-timer";
import {background} from "../images/background";
import {Ruler} from "../components/lib/ruler";
import {Box} from "../clip-path-calculator";
import {useReplicant} from "../../use-replicant";

const {hasSponsor} = nodecg.bundleConfig;

const gameBoxes: Box[] = [
	[97, 952, 165, 735],
	[968, 1823, 165, 735],
];
const cameraBox: Box = [750, 1170, 750, 1065];

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 0;
	height: 180px;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: 0;
	width: ${(props: {camera: boolean}) => (props.camera ? 750 : 1140)}px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	right: ${hasSponsor ? 210 : 0}px;
	left: ${(props: {camera: boolean}) => (props.camera ? 1170 : 1143)}px;
`;

const StyledRuler = styled(Ruler)`
	${bottomStyle};
	left: 1140px;
	bottom: 15px;
	height: 150px;
	width: 3px;
`;

const infoHeights = {
	primaryHeight: 68 * 1.5,
	secondaryHeight: 38 * 1.5,
};

const runnerStyle = css`
	position: absolute;
	top: 750px;
	width: ${(props: {camera: boolean}) => (props.camera ? 735 : 855)}px;
	height: 60px;
`;

const LeftRunner = styled.div`
	${runnerStyle};
	left: ${(props: {camera: boolean}) => (props.camera ? 15 : 97)}px;
`;

const RightRunner = styled.div`
	${runnerStyle};
	right: ${(props: {camera: boolean}) => (props.camera ? 15 : 97)}px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: 825px;
	right: ${(props: {camera: boolean}) => (props.camera ? 15 : 97)}px;
`;

const currentRunRep = nodecg.Replicant("current-run");
const App = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const camera = Boolean(currentRun?.camera);
	return (
		<Container
			backgroundImage={background}
			clipBoxes={camera ? [...gameBoxes, cameraBox] : gameBoxes}
		>
			<LeftRunner camera={camera}>
				<RtaijRunner index={0} showFinishTime gradientBackground />
			</LeftRunner>
			<RightRunner camera={camera}>
				<RtaijRunner index={1} showFinishTime gradientBackground />
			</RightRunner>
			<CommentatorContainer camera={camera}>
				<RtaijCommentator index={0} gradientBackground />
			</CommentatorContainer>
			<GameContainer camera={camera}>
				<RtaijGame {...infoHeights} />
			</GameContainer>
			{!camera && <StyledRuler />}
			<TimerContainer camera={camera}>
				<RtaijTimer {...infoHeights} />
			</TimerContainer>
			<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={180} />
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
