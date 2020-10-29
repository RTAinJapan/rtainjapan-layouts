import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import separatorBlue from '../images/break/separator-blue.png';
import separatorBrown from '../images/break/separator-brown.png';
import {Schedule} from '../../../nodecg/replicants';

const {colorTheme} = nodecg.bundleConfig;
const Container = styled.div`
	font-family: 'MigMix 2P';
	color: ${colorTheme === 'brown' ? '#60392f' : '#2d4273'};

	height: 87px;
	box-sizing: border-box;
	padding: 7.5px 22.5px 7.5px 22.5px;

	background-color: rgba(255, 255, 255, 0.65);
	/* box-shadow: 4.5px 4.5px 6px -1.5px rgba(0, 0, 0, 1); */

	display: flex;
	flex-flow: row nowrap;
	align-items: center;

	border-left: 15px ${colorTheme === 'brown' ? '#d2997b' : '#a7bfff'} solid;
	&:first-child {
		border-left-color: ${colorTheme === 'brown' ? '#824218' : '#4d7dff'};
	}
`;

const InfoContainer = styled.div`
	display: grid;
	grid-template-rows: auto auto;
	justify-items: start;
`;

const Title = styled.div`
	font-size: ${24 * 1.5}px;
	line-height: ${28 * 1.5}px;
	font-weight: bold;
`;

const Misc = styled.div`
	font-size: ${16 * 1.5}px;
	line-height: ${20 * 1.5}px;
`;

const Time = styled(Misc)`
	text-align: center;
`;

export class UpcomingRun extends React.Component<{
	upcomingRuns: Schedule;
	index: number;
}> {
	public render() {
		const run = this.props.upcomingRuns[this.props.index];
		if (!run) {
			return null;
		}
		const {title, category} = run;
		const runners =
			run.runners &&
			`Runner: ${run.runners
				.map((runner) => runner.name)
				.filter(Boolean)
				.join(', ')}`;
		const misc =
			category && runners
				? `${category} | ${runners}`
				: category || runners;
		return (
			<Container>
				<InfoContainer>
					<Title>{title}</Title>
					<Misc>{misc}</Misc>
				</InfoContainer>
				<img
					src={
						colorTheme === 'brown' ? separatorBrown : separatorBlue
					}
				/>
				<Time>{this.calcRemainingTime()}</Time>
			</Container>
		);
	}

	private calcRemainingTime = () => {
		if (this.props.index === 0) {
			return 'このあとすぐ！';
		}
		let remaining = moment.duration(0);
		for (let i = this.props.index - 1; i >= 0; i--) {
			const run = this.props.upcomingRuns[i];
			if (!run) {
				continue;
			}
			remaining.add(moment.duration(run.runDuration));
			remaining.add(moment.duration(run.setupDuration));
		}
		return (
			<>
				あと
				<br />
				{Math.floor(remaining.asHours())}時間{remaining.minutes()}分
			</>
		);
	};
}
