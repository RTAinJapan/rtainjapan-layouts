import '../styles/common.css';

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import {background} from '../images/background';
import {useReplicant} from '../../use-replicant';
import {CameraPlaceholder} from '../components/camera-placeholder';
import {Box} from '../clip-path-calculator';

const gameBoxes: Box[] = [
	[150 + 525 + 15, 150 + 525 + 15 + 600, 15, 15 + 900],
	[150 + 525 + 15 + 600 + 15, 150 + 525 + 15 + 600 + 15 + 600, 15, 15 + 900],
];

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 0px;
	height: 536px;
	width: ${150 + 537 + 15}px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 30px;
`;

const RunnerContainer = styled.div`
	position: absolute;
	height: 90px;
	width: 420px;
`;

const CommentatorContainer = styled.div`
	position: absolute;
	left: 15px;
	bottom: 165px;
	height: 60px;
	width: 660px;
`;

const StyledCameraPlaceholder = styled(CameraPlaceholder)`
	position: absolute;
	width: 180px;
	height: 135px;
`;

const currentRunRep = nodecg.Replicant('current-run');
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
				15 + 660 + 16 + 420,
				15 + 660 + 16 + 420 + 180,
				1080 - 15 - 135,
				1080 - 15,
			]);
		}
		if (currentRun.runners[1]?.camera) {
			cameraHoles.push([
				1920 - 15 - 180,
				1920 - 15,
				1080 - 15 - 135,
				1080 - 15,
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
			<RunnerContainer style={{bottom: '45px', left: `${15 + 660 + 15}px`}}>
				<RtaijRunner index={0} columnDirection gradientBackground />
			</RunnerContainer>
			<RunnerContainer style={{bottom: '45px', right: `${15 + 180}px`}}>
				<RtaijRunner index={1} columnDirection gradientBackground />
			</RunnerContainer>

			<StyledCameraPlaceholder
				style={{bottom: `15px`, right: `${15 + 600 + 15}px`}}
			></StyledCameraPlaceholder>
			<StyledCameraPlaceholder
				style={{bottom: `15px`, right: `15px`}}
			></StyledCameraPlaceholder>

			<CommentatorContainer>
				<RtaijCommentator gradientBackground index={0} />
			</CommentatorContainer>
			<RtaijOverlay
				TweetProps={{widthPx: 540, hideLogo: true}}
				bottomHeightPx={150}
				sponsorLeft
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
