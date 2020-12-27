import '../styles/common.css';

import React from 'react';
import ReactDOM from 'react-dom';
import styled, {css} from 'styled-components';
import {Container} from '../components/lib/styled';
import {RtaijCommentator} from '../components/rtaij-commentator';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import {background} from '../images/background';
import {calculateClipPath} from '../clip-path-calculator';
import {useReplicant} from '../../use-replicant';

const {hasSponsor} = nodecg.bundleConfig;

const StyledContainer = styled(Container)`
	background-image: url(${background});
	${(props: {camera: boolean}) => {
		const boxes: [number, number, number, number][] = [
			[141, 897, 168, 735],
			[1023, 1779, 168, 735],
		];
		if (props.camera) {
			boxes.push([750, 1170, 750, 1065]);
		}
		return calculateClipPath(boxes);
	}}
`;

const bottomStyle = css`
	position: absolute;
	z-index: 10;
	bottom: 15px;
	height: 165px;
`;

const GameContainer = styled.div`
	${bottomStyle};
	left: 0;
	width: ${(props: {camera: boolean}) => (props.camera ? '750px' : '50%')};
`;

const TimerContainer = styled.div`
	${bottomStyle};
	right: ${hasSponsor ? 210 : 0}px;
	left: ${(props: {camera: boolean}) => (props.camera ? '1170px' : '50%')};
`;

const infoHeights = {
	primaryHeight: 68 * 1.5,
	secondaryHeight: 38 * 1.5,
};

const runnerStyle = css`
	position: absolute;
	top: ${(100 + 12 + 378 + 10) * 1.5}px;
	width: ${(props: {camera: boolean}) => (props.camera ? 735 : 756)}px;
	height: 60px;
`;
const LeftRunner = styled.div`
	${runnerStyle};
	left: ${(props: {camera: boolean}) => (props.camera ? 15 : 141)}px;
`;

const RightRunner = styled.div`
	${runnerStyle};
	right: ${(props: {camera: boolean}) => (props.camera ? 15 : 141)}px;
`;

const CommentatorContainer = styled.div`
	${runnerStyle};
	top: ${(100 + 12 + 378 + 10 + 40 + 10) * 1.5}px;
	right: ${(props: {camera: boolean}) => (props.camera ? 15 : 141)}px;
	width: ${(props: {camera: boolean}) => (props.camera ? 735 : 756)}px;
`;

const currentRunRep = nodecg.Replicant('current-run');
const App = () => {
	const [currentRun] = useReplicant(currentRunRep);
	const camera = Boolean(currentRun?.camera);
	return (
		<StyledContainer camera={camera}>
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
			<TimerContainer camera={camera}>
				<RtaijTimer {...infoHeights} />
			</TimerContainer>
			<RtaijOverlay TweetProps={{rowDirection: true}} bottomHeightPx={180} />
		</StyledContainer>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
