import '../styles/common.css';

import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import {Container} from '../components/lib/styled';
import {RtaijGame} from '../components/rtaij-game';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {RtaijRunner} from '../components/rtaij-runner';
import {RtaijTimer} from '../components/rtaij-timer';
import {background} from '../images/background';

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		96px 0px,
		96px 547px,
		96px 1006px,
		912px 1006px,
		912px 547px,
		96px 547px,
		96px 0px,
		1008px 0px,
		1008px 14px,
		1008px 473px,
		1824px 473px,
		1824px 14px,
		1008px 14px,
		1008px 0px,
		1008px 0px,
		1008px 547px,
		1008px 1006px,
		1824px 1006px,
		1824px 547px,
		1008px 547px,
		1008px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

const InfoContainer = styled.div`
	position: absolute;
	top: 150px;
	left: 96px;
	height: 397px;
	width: 816px;

	display: grid;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: stretch;
	grid-gap: 20px;
`;

const RunnerContainer = styled.div`
	position: absolute;
	width: 816px;
	height: 60px;
`;

const App = () => (
	<StyledContainer>
		<InfoContainer>
			<RtaijGame gradientBackground primaryHeight={100} />
			<RtaijTimer gradientBackground primaryHeight={100} />
		</InfoContainer>
		<RunnerContainer style={{top: '473px', right: '96px'}}>
			<RtaijRunner showFinishTime index={0} gradientBackground />
		</RunnerContainer>
		<RunnerContainer style={{bottom: '14px', left: '96px'}}>
			<RtaijRunner showFinishTime index={1} />
		</RunnerContainer>
		<RunnerContainer style={{bottom: '14px', right: '96px'}}>
			<RtaijRunner showFinishTime index={2} />
		</RunnerContainer>
		<RtaijOverlay
			TweetProps={{rowDirection: true, maxHeightPx: 150, widthPx: 540}}
			bottomHeightPx={150}
		/>
	</StyledContainer>
);

ReactDom.render(<App />, document.getElementById('root'));
