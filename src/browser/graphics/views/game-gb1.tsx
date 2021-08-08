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
import {Box} from "../clip-path-calculator";
import {useReplicant} from "../../use-replicant";

const gameBox: Box = [840, 1830, 24, 915];
const cameraBox: Box = [90, 762, 687, 1065];

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

const runnerStyle = css`
	position: absolute;
	left: ${(props: {camera: boolean}) =>
		props.camera ? (60 + 448) * 1.5 : 15}px;
	right: ${160 * 1.5}px;
	height: 60px;
`;

const RunnerContainer = styled.div`
	${runnerStyle};
	bottom: 75px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
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
			<RtaijOverlay
				TweetProps={{widthPx: 450 * 1.5, hideLogo: true}}
				bottomHeightPx={150}
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
