import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

import {RtaijOverlay} from '../components/rtaij-overlay';
import notification from '../images/break/notification.png';
import {BreakBackground} from '../components/break-background';
import {Schedule} from '../../../types/schemas/schedule';
import {scheduleRep} from '../../lib/replicants';
import {CurrentRun} from '../../../types/schemas/currentRun';
import nodecg from '../../lib/nodecg';
import {UpcomingRun} from '../components/upcoming-run';

const NotificationIcon = styled.img.attrs({src: notification})`
	position: absolute;
	left: 60px;
	bottom: 15px;
`;

const NotificationText = styled.div`
	position: absolute;
	left: 225px;
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

	background-color: #4d7dff;
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
	top: ${150 + 50 + 45 + 70}px;
	left: 120px;

	display: grid;
	grid-auto-flow: row;
	grid-gap: 70px;
	justify-items: start;
`;

interface State {
	upcomingRuns: CurrentRun[];
}

class Break extends React.Component<{}, State> {
	public state: State = {upcomingRuns: []};

	public render() {
		return (
			<div>
				<BreakBackground />
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
					{this.state.upcomingRuns.map(run => (
						<UpcomingRun key={run.pk} {...run} />
					))}
				</UpcomingContainer>
			</div>
		);
	}

	public componentDidMount() {
		scheduleRep.on('change', this.updateUpcoming);
	}

	public componentWillUnmount() {
		scheduleRep.removeListener('change', this.updateUpcoming);
	}

	private readonly updateUpcoming = () => {
		nodecg.readReplicant<CurrentRun>('currentRun', currentRun => {
			const currentRunIndex = currentRun.index || 0;
			nodecg.readReplicant<Schedule>('schedule', schedule => {
				this.setState({
					upcomingRuns: schedule.slice(
						currentRunIndex,
						currentRunIndex + 3
					),
				});
			});
		});
	};
}

ReactDom.render(<Break />, document.getElementById('break'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
