import '../styles/common.css';

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {Container} from '../components/lib/styled';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import {background} from '../images/background';
import {CameraPlaceholder} from '../components/camera-placeholder';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {useReplicant} from '../../use-replicant';
import {Box} from '../clip-path-calculator';

const gameBoxes: Box[] = [
	[1920 - 15 - 760, 1920 - 15, 13, 13 + 432],
	[370, 370 + 760, 150 + 395, 150 + 395 + 432],
	[1920 - 15 - 760, 1920 - 15, 150 + 395, 150 + 395 + 432],
];

const InfoContainer = styled.div`
	position: absolute;
	top: 180px;
	left: 370px;
	height: 335px;
	width: 760px;

	display: grid;
	grid-template-rows: 1fr 1fr;
	align-content: center;
	justify-content: stretch;
	grid-gap: 30px;
`;

const RunnerContainer = styled.div`
	position: absolute;
	width: ${760 - 160}px;
	height: ${90}px;
`;

const StyledCameraPlaceholder = styled(CameraPlaceholder)`
	position: absolute;
	width: 160px;
	height: 90px;
`;

const currentRunRep = nodecg.Replicant('current-run');
const App: React.FunctionComponent = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const [additionalBoxes, setAdditionalBoxes] = useState<Array<Box>>([]);

	useEffect(() => {
		if (!currentRun) {
			return;
		}
		const cameraHoles: Array<Box> = [];
		if (currentRun.runners[0]?.camera) {
			cameraHoles.push([1920 - 15 - 160, 1920 - 15, 13 + 432, 13 + 432 + 90]);
		}
		if (currentRun.runners[1]?.camera) {
			cameraHoles.push([
				1920 - 15 - 760 - 15 - 160,
				1920 - 15 - 760 - 15,
				150 + 395 + 432,
				1080 - 13,
			]);
		}
		if (currentRun.runners[2]?.camera) {
			cameraHoles.push([
				1920 - 15 - 160,
				1920 - 15,
				150 + 395 + 432,
				1080 - 13,
			]);
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
			<RunnerContainer style={{top: `${13 + 432}px`, right: `${160 + 15}px`}}>
				<RtaijRunner columnDirection index={0} gradientBackground />
			</RunnerContainer>
			<StyledCameraPlaceholder
				style={{top: `${13 + 432}px`, right: '15px'}}
			></StyledCameraPlaceholder>
			<RunnerContainer style={{bottom: '13px', left: `${15 + 340 + 15}px`}}>
				<RtaijRunner columnDirection index={1} />
			</RunnerContainer>
			<StyledCameraPlaceholder
				style={{bottom: '13px', right: `${15 + 760 + 15}px`}}
			></StyledCameraPlaceholder>
			<RunnerContainer style={{bottom: '13px', right: `${160 + 15}px`}}>
				<RtaijRunner columnDirection index={2} />
			</RunnerContainer>
			<StyledCameraPlaceholder
				style={{bottom: '13px', right: '15px'}}
			></StyledCameraPlaceholder>
			<div
				style={{
					position: 'absolute',
					left: '15px',
					bottom: `${150 + 15}px`,
					height: '90px',
					width: '340px',
				}}
			>
				<RtaijCommentator
					index={0}
					columnDirection
					gradientBackground
				></RtaijCommentator>
			</div>
			<RtaijOverlay
				TweetProps={{
					maxHeightPx: 615,
					widthPx: 355,
					leftAttached: true,
				}}
				bottomHeightPx={150}
				sponsorLeft
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
