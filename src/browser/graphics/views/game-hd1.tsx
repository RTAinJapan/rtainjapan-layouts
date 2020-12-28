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

const gameBox: Box = [465, 1905, 15, 825];
const cameraBox: Box = [15, 447, 741, 1065];

const NameContainer = styled.div`
	position: absolute;
	left: 15px;
	height: 90px;
	width: 432px;
	display: grid;
`;

const RunnerContainer = styled(NameContainer)`
	bottom: 459px;
`;

const CommentatorContainer = styled(NameContainer)`
	bottom: 354px;
`;

const infoStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 15px;
	height: 210px;
	display: grid;
`;

const GameContainer = styled.div`
	${infoStyle};
	left: ${(props: {camera: boolean}) => (props.camera ? 480 : 0)}px;
	right: 645px;
`;

const TimerContainer = styled.div`
	${infoStyle};
	left: 1278px;
	right: ${hasSponsor ? 210 : 0}px;
`;

const StyledRuler = styled(Ruler)`
	${infoStyle};
	right: 642px;
	width: 3px;
`;

const infoHeights = {
	primaryHeight: 132,
	secondaryHeight: 72,
	thickRuler: true,
};

const currentRunRep = nodecg.Replicant('current-run');
const App = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const camera = Boolean(currentRun?.camera);
	return (
		<Container
			backgroundImage={background}
			clipBoxes={camera ? [gameBox, cameraBox] : [gameBox]}
		>
			<RunnerContainer>
				<RtaijRunner index={0} gradientBackground columnDirection />
			</RunnerContainer>
			<CommentatorContainer>
				<RtaijCommentator index={0} gradientBackground columnDirection />
			</CommentatorContainer>

			<GameContainer camera={Boolean(currentRun?.camera)}>
				<RtaijGame {...infoHeights} />
			</GameContainer>
			<StyledRuler />
			<TimerContainer>
				<RtaijTimer {...infoHeights} />
			</TimerContainer>

			<RtaijOverlay
				bottomHeightPx={240}
				TweetProps={{leftAttached: true, widthPx: (10 + 288) * 1.5}}
			/>
		</Container>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
