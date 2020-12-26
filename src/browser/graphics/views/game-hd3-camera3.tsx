import '../styles/common.css';

import React from 'react';
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

const StyledContainer = styled(Container)`
	background-image: url(${background});
	clip-path: polygon(
		0px 0px,
		370px 0px,
		370px 545px,
		370px 977px,
		1130px 977px,
		1130px 545px,
		370px 545px,
		370px 0px,
		1145px 0px,
		1145px 13px,
		1145px 445px,
		1905px 445px,
		1905px 13px,
		1145px 13px,
		1145px 0px,
		1145px 0px,
		1145px 545px,
		1145px 977px,
		1905px 977px,
		1905px 545px,
		1145px 545px,
		1145px 0px,
		1920px 0px,
		1920px 1080px,
		0px 1080px,
		0px 0px
	);
`;

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

const App = () => (
	<StyledContainer>
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
	</StyledContainer>
);

ReactDOM.render(<App />, document.getElementById('root'));
