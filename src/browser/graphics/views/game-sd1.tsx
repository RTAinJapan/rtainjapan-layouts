import "../styles/common.css";

import React from "react";
import ReactDOM from "react-dom";
import styled, {css} from "styled-components";
import {Container} from "../components/lib/styled";
import {RtaijCommentator} from "../components/rtaij-commentator";
import {RtaijGame} from "../components/rtaij-game";
import {RtaijOverlay} from "../components/rtaij-overlay";
import {RtaijRunner} from "../components/rtaij-runner";
import {RtaijTimer} from "../components/rtaij-timer";
import {background} from "../images/background";
import {useReplicant} from "../../use-replicant";
import {Box} from "../clip-path-calculator";

const {hasSponsor} = nodecg.bundleConfig;

const gameBoxes: Box[] = [[705, 1905, 15, 915]];
const cameraBoxes: Box[] = [[15, 687, 687, 1065]];

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0px;
	height: 537px;
	width: ${470 * 1.5}px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 20px;
`;

const participantStyle = css`
	position: absolute;
	left: ${(props: {camera: boolean}) => (props.camera ? 687 : 30)}px;
	right: ${hasSponsor ? 240 : 30}px;
	height: 60px;
`;

const RunnerContainer = styled.div`
	${participantStyle}
	bottom: 75px;
`;

const CommentatorContainer = styled.div`
	${participantStyle}
	bottom: 15px;
`;

const currentRunRep = nodecg.Replicant("current-run");
const App: React.FunctionComponent = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const camera = Boolean(currentRun?.camera);

	return (
		<Container
			backgroundImage={background}
			clipBoxes={camera ? [...gameBoxes, ...cameraBoxes] : gameBoxes}
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
				TweetProps={{widthPx: 360 * 1.5, hideLogo: true}}
				bottomHeightPx={150}
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
