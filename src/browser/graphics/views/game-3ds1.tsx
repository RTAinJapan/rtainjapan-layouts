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
import {useReplicant} from '../../use-replicant';
import {Box} from '../clip-path-calculator';

const {hasSponsor} = nodecg.bundleConfig;
const gameBoxes: Box[] = [
	[90, 690, 240, 690],
	[705, 1830, 15, 690],
];
const cameraBox: Box[] = [[15, 495, 705, 1065]];

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
	left: ${(props: {camera: boolean}) => (props.camera ? 15 + 480 : 90)}px;
	right: ${(props: {camera: boolean}) => (props.camera ? 15 : 90)}px;
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

const currentRunRep = nodecg.Replicant('current-run');
const App: React.FunctionComponent = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const cameraEnabled = Boolean(currentRun?.camera);
	return (
		<Container
			backgroundImage={background}
			clipBoxes={cameraEnabled ? [...gameBoxes, ...cameraBox] : gameBoxes}
		>
			<Runner camera={cameraEnabled}>
				<RtaijRunner index={0} showFinishTime gradientBackground />
			</Runner>
			<CommentatorContainer camera={cameraEnabled}>
				<RtaijCommentator index={0} gradientBackground />
			</CommentatorContainer>
			<GameContainer camera={cameraEnabled}>
				<RtaijGame {...infoHeights} />
			</GameContainer>
			<StyledRuler />
			<TimerContainer>
				<RtaijTimer {...infoHeights} />
			</TimerContainer>
			<RtaijOverlay
				TweetProps={{widthPx: 540, hideLogo: true}}
				bottomHeightPx={225}
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
