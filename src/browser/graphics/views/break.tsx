import '../styles/common.css';

import React from 'react';
import ReactDom from 'react-dom';
import styled, {css} from 'styled-components';

import {Container} from '../components/lib/styled';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {UpcomingRun} from '../components/upcoming-run';
import notificationIconBlue from '../images/break/notification-blue.png';
import notificationIconBrown from '../images/break/notification-brown.png';
import {Schedule, CurrentRun} from '../../../nodecg/replicants';

const currentRunRep = nodecg.Replicant('current-run');
const scheduleRep = nodecg.Replicant('schedule');
const {onsite} = nodecg.bundleConfig;
const {colorTheme} = nodecg.bundleConfig;

const StyledContainer = styled(Container)`
	${onsite &&
		css`
			clip-path: polygon(
				0px 0px,
				15px 0px,
				15px 714px,
				15px 1065px,
				639px 1065px,
				639px 714px,
				15px 714px,
				15px 0px,
				1920px 0px,
				1920px 1080px,
				0px 1080px,
				0px 0px
			);
		`}
`;

const NotificationIcon = styled.img`
	position: absolute;
	left: ${onsite ? 669 : 60}px;
	bottom: 15px;
`;

const NotificationText = styled.div`
	position: absolute;
	left: ${onsite ? 834 : 225}px;
	bottom: 0px;
	height: 150px;

	color: #ffffff;
	font-family: 'MigMix 2P';
	font-weight: bold;
	font-size: 45px;
	line-height: 120%;

	display: grid;
	align-content: center;
`;

const UpcomingTitle = styled.div`
	position: absolute;
	top: 200px;
	left: 60px;
	width: 180px;

	background-color: ${colorTheme == 'brown' ? '#60392f' : '#4d7dff'};
	box-shadow: 4.5px 4.5px 6px -1.5px rgba(0, 0, 0, 1);

	font-family: 'MigMix 2P';
	font-weight: bold;
	font-size: 30px;
	line-height: 45px;
	color: #ffffff;
	text-align: center;
`;

const UpcomingContainer = styled.div`
	position: absolute;
	top: ${150 + 50 + 45 + 50}px;
	left: 120px;

	display: grid;
	grid-auto-flow: row;
	grid-gap: 73px;
	justify-items: start;
`;

const CurrentTrackContainer = styled.div`
	position: absolute;
	bottom: 165px;
	right: 15px;
	height: 40px;
	background-color: rgba(0, 10, 60, 0.5);
	font-size: 22px;
	line-height: 22px;
	padding: 9px 16px;

	color: white;
	border-radius: 12px;
`;

interface State {
	schedule: Schedule;
	currentRunIndex: number;
	currentTrack?: {name: string; artists: string; album: string};
}

class Break extends React.Component<{}, State> {
	public state: State = {schedule: [], currentRunIndex: 0};
	private readonly spotifyRep = nodecg.Replicant('spotify');

	public render() {
		const upcomingRuns = this.state.schedule.slice(
			this.state.currentRunIndex,
			this.state.currentRunIndex + 3,
		);
		return (
			<StyledContainer>
				<RtaijOverlay
					bottomHeightPx={150}
					isBreak
					TweetProps={{rowDirection: true}}
				/>
				<NotificationIcon
					src={
						colorTheme === 'brown'
							? notificationIconBrown
							: notificationIconBlue
					}
				/>
				<NotificationText>
					準備中です、しばらくお待ち下さい
				</NotificationText>
				<UpcomingTitle>今後の予定</UpcomingTitle>
				<UpcomingContainer>
					{upcomingRuns.map((run, index) => (
						<UpcomingRun
							key={run.pk}
							index={index}
							upcomingRuns={upcomingRuns}
						/>
					))}
				</UpcomingContainer>
				{this.state.currentTrack && (
					<CurrentTrackContainer>
						{`♪ ${this.state.currentTrack.name} / ${this.state.currentTrack.album} / Copyright © Nihon Falcom Corporation`}
					</CurrentTrackContainer>
				)}
			</StyledContainer>
		);
	}

	public componentDidMount() {
		scheduleRep.on('change', this.scheduleChangeHandler);
		currentRunRep.on('change', this.currentRunChangeHandler);
		this.spotifyRep.on('change', (newVal) => {
			this.setState({
				currentTrack: {
					name: '',
					artists: '',
					album: '',
					...newVal.currentTrack,
				},
			});
		});
	}

	public componentWillUnmount() {
		scheduleRep.removeListener('change', this.scheduleChangeHandler);
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
	}

	private readonly scheduleChangeHandler = (newVal: Schedule) => {
		this.setState({schedule: newVal});
	};

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		if (!newVal) {
			return;
		}
		this.setState({currentRunIndex: newVal.index || 0});
	};
}

ReactDom.render(<Break />, document.getElementById('break'));
