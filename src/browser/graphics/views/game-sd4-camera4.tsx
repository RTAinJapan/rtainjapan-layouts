import "../styles/common.css";

import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {Container} from "../components/lib/styled";
import {RtaijCommentator} from "../components/rtaij-commentator";
import {RtaijGame} from "../components/rtaij-game";
import {RtaijOverlay} from "../components/rtaij-overlay";
import {RtaijRunner} from "../components/rtaij-runner";
import {RtaijTimer} from "../components/rtaij-timer";
import {background} from "../images/background";
import {useReplicant} from "../../use-replicant";
import {CameraPlaceholder} from "../components/camera-placeholder";
import {Box} from "../clip-path-calculator";

const gameBoxes: Box[] = [
	[183 + 540 + 15, 183 + 540 + 15 + 576, 13, 13 + 432],
	[183 + 540 + 15 + 576 + 15, 183 + 540 + 15 + 576 + 15 + 576, 13, 13 + 432],
	[
		183 + 540 + 15,
		183 + 540 + 15 + 576,
		13 + 432 + 90 + 10,
		13 + 432 + 90 + 10 + 432,
	],
	[
		183 + 540 + 15 + 576 + 15,
		183 + 540 + 15 + 576 + 15 + 576,
		13 + 432 + 90 + 10,
		13 + 432 + 90 + 10 + 432,
	],
];

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0px;
	height: 537px;
	width: 738px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 20px;
`;

const RunnerContainer = styled.div`
	position: absolute;
	height: 90px;
	width: 416px;
`;

const CommentatorContainer = styled.div`
	position: absolute;
	left: 15px;
	bottom: 165px;
	height: 60px;
	width: 710px;
`;

const StyledCameraPlaceholder = styled(CameraPlaceholder)`
	position: absolute;
	width: 160px;
	height: 90px;
`;

const currentRunRep = nodecg.Replicant("current-run");
const App: React.FunctionComponent = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const [additionalBoxes, setAdditionalBoxes] = useState<Box[]>([]);

	useEffect(() => {
		if (!currentRun) {
			return;
		}
		const cameraHoles: Array<Box> = [];
		if (currentRun.runners[0]?.camera) {
			cameraHoles.push([
				1920 - 15 - 576 - 15 - 160,
				1920 - 15 - 576 - 15,
				13 + 432,
				13 + 432 + 90,
			]);
		}
		if (currentRun.runners[1]?.camera) {
			cameraHoles.push([1920 - 15 - 160, 1920 - 15, 13 + 432, 13 + 432 + 90]);
		}
		if (currentRun.runners[2]?.camera) {
			cameraHoles.push([
				1920 - 15 - 576 - 15 - 160,
				1920 - 15 - 576 - 15,
				1080 - 13 - 90,
				1080 - 13,
			]);
		}
		if (currentRun.runners[3]?.camera) {
			cameraHoles.push([1920 - 15 - 160, 1920 - 15, 1080 - 13 - 90, 1080 - 13]);
		}
		setAdditionalBoxes(cameraHoles);
	}, [currentRun]);

	return (
		<Container
			backgroundImage={background}
			clipBoxes={[...gameBoxes, ...additionalBoxes]}
		>
			<InfoContainer>
				<RtaijGame gradientBackground primaryHeight={100} />
				<RtaijTimer gradientBackground primaryHeight={100} />
			</InfoContainer>
			<RunnerContainer
				style={{top: `${445}px`, right: `${15 + 576 + 15 + 160}px`}}
			>
				<RtaijRunner index={0} columnDirection gradientBackground />
			</RunnerContainer>
			<RunnerContainer style={{top: "445px", right: `${15 + 160}px`}}>
				<RtaijRunner index={1} columnDirection gradientBackground />
			</RunnerContainer>
			<RunnerContainer
				style={{bottom: "13px", right: `${15 + 576 + 15 + 160}px`}}
			>
				<RtaijRunner index={2} columnDirection />
			</RunnerContainer>
			<RunnerContainer style={{bottom: "13px", right: `${15 + 160}px`}}>
				<RtaijRunner index={3} columnDirection />
			</RunnerContainer>

			<StyledCameraPlaceholder
				style={{top: `${13 + 432}px`, right: `${15 + 576 + 15}px`}}
			></StyledCameraPlaceholder>
			<StyledCameraPlaceholder
				style={{top: `${13 + 432}px`, right: "15px"}}
			></StyledCameraPlaceholder>
			<StyledCameraPlaceholder
				style={{bottom: "13px", right: `${15 + 576 + 15}px`}}
			></StyledCameraPlaceholder>
			<StyledCameraPlaceholder
				style={{bottom: "13px", right: "15px"}}
			></StyledCameraPlaceholder>

			<CommentatorContainer>
				<RtaijCommentator index={0} />
			</CommentatorContainer>
			<RtaijOverlay
				TweetProps={{widthPx: 540, hideLogo: true}}
				bottomHeightPx={150}
				sponsorLeft
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
