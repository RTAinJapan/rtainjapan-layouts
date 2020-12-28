import '../styles/common.css';

import React from 'react';
import ReactDOM from 'react-dom';
import styled, {css} from 'styled-components';
import {Ruler} from '../components/lib/ruler';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import {background} from '../images/background';
import {Box} from '../clip-path-calculator';
import {useReplicant} from '../../use-replicant';

const {hasSponsor} = nodecg.bundleConfig;

const gameBoxes: Box[] = [
	[202, 802, 240, 690],
	[818, 1718, 15, 690],
];
const cameraBox: Box = [15, 495, 705, 1065];

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	height: 225px;
	bottom: 0;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: ${(props: {camera: boolean}) => (props.camera ? 495 : 0)}px;
	width: 1140px;
`;

const TimerContainer = styled.div`
	${bottomStyle};
	left: 1143px;
	right: ${hasSponsor ? 210 : 0}px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
};

const runnerStyle = css`
	position: absolute;
	left: ${(props: {camera: boolean}) => (props.camera ? 15 + 480 : 202)}px;
	right: ${(props: {camera: boolean}) => (props.camera ? 15 : 202)}px;
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
	left: 1140px;
	bottom: 15px;
	width: 3px;
	height: 195px;
`;

// TODO: game/timer boxes are overwrapping when with camera
const currentRunRep = nodecg.Replicant('current-run');
const App = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const camera = Boolean(currentRun?.camera);
	return (
		<Container
			backgroundImage={background}
			clipBoxes={camera ? [...gameBoxes, cameraBox] : gameBoxes}
		>
			<Runner camera={camera}>
				<RtaijRunner index={0} showFinishTime gradientBackground />
			</Runner>
			<CommentatorContainer camera={camera}>
				<RtaijCommentator index={0} gradientBackground />
			</CommentatorContainer>
			<GameContainer camera={camera}>
				<RtaijGame {...infoHeights} />
			</GameContainer>
			<StyledRuler />
			<TimerContainer>
				<RtaijTimer {...infoHeights} />
			</TimerContainer>
			<RtaijOverlay
				TweetProps={{widthPx: 652, hideLogo: true}}
				bottomHeightPx={225}
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
