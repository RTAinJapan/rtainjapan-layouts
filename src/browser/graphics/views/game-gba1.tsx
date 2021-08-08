import "../styles/common.css";

import ReactDOM from "react-dom";
import styled from "styled-components";
import {Container} from "../components/lib/styled";
import {RtaijCommentator} from "../components/rtaij-commentator";
import {RtaijGame} from "../components/rtaij-game";
import {RtaijOverlay} from "../components/rtaij-overlay";
import {RtaijRunner} from "../components/rtaij-runner";
import {RtaijTimer} from "../components/rtaij-timer";
import {background} from "../images/background";
import {Box} from "../clip-path-calculator";
import {useReplicant} from "../../use-replicant";

const {hasSponsor} = nodecg.bundleConfig;

const gameBox: Box = [741, 1851, 165, 915];
const cameraBox: Box = [54, 726, 686, 1065];

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
	left: ${(props: {camera: boolean}) => (props.camera ? 54 + 672 : 30)}px;
	right: ${hasSponsor ? 240 : 30}px;
	height: 60px;
`;

const CommentatorContainer = styled(RunnerContainer)`
	bottom: 15px;
`;

const currentRunRep = nodecg.Replicant("current-run");
const App = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const camera = Boolean(currentRun?.camera);
	return (
		<Container
			backgroundImage={background}
			clipBoxes={camera ? [gameBox, cameraBox] : [gameBox]}
		>
			<InfoContainer>
				<RtaijGame gradientBackground primaryHeight={100} />
				<RtaijTimer gradientBackground primaryHeight={100} />
			</InfoContainer>
			<RunnerContainer camera={camera}>
				<RtaijRunner index={0} />
			</RunnerContainer>
			<CommentatorContainer camera={camera}>
				<RtaijCommentator index={0} />
			</CommentatorContainer>
			<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={150} />
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
