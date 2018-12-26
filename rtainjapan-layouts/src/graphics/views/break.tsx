import '../styles/common.css';

import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

import {CurrentRun, ReplicantName as R, Schedule} from '../../replicants';
import {Container} from '../components/lib/styled';
import {RtaijOverlay} from '../components/rtaij-overlay';
import {UpcomingRun} from '../components/upcoming-run';
import breakBackgroundImg from '../images/break/break-background.png';
import notification from '../images/break/notification.png';

const currentRunRep = nodecg.Replicant<CurrentRun>(R.CurrentRun);
const scheduleRep = nodecg.Replicant<Schedule>(R.Schedule);

const StyledContainer = styled(Container)`
	background-image: url(${breakBackgroundImg});
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
`;

const NotificationIcon = styled.img.attrs({src: notification})`
	position: absolute;
	left: ${15 + 624 + 30}px;
	bottom: 15px;
`;

const NotificationText = styled.div`
	position: absolute;
	left: ${15 + 624 + 30 + 135 + 30}px;
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

	background-color: #60392f;
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
	top: ${150 + 50 + 45 + 48}px;
	left: 120px;

	display: grid;
	grid-auto-flow: row;
	grid-gap: 48px;
	justify-items: start;
`;

interface State {
	schedule: Schedule;
	currentRunIndex: number;
}

class Break extends React.Component<{}, State> {
	public state: State = {schedule: [], currentRunIndex: 0};

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
				<NotificationIcon />
				<NotificationText>
					準備中です、しばらくお待ち下さい
				</NotificationText>
				<UpcomingTitle>今後の予定</UpcomingTitle>
				<UpcomingContainer>
					{upcomingRuns.map((run) => (
						<UpcomingRun key={run.pk} {...run} />
					))}
				</UpcomingContainer>
			</StyledContainer>
		);
	}

	public componentDidMount() {
		scheduleRep.on('change', this.scheduleChangeHandler);
		currentRunRep.on('change', this.currentRunChangeHandler);
	}

	public componentWillUnmount() {
		scheduleRep.removeListener('change', this.scheduleChangeHandler);
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
	}

	private readonly scheduleChangeHandler = (newVal: Schedule) => {
		this.setState({schedule: newVal});
	};

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		this.setState({currentRunIndex: newVal.index || 0});
	};
}

ReactDom.render(<Break />, document.getElementById('break'));
