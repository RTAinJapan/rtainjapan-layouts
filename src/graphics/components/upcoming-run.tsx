import React from 'react';
import {differenceInHours, differenceInMinutes} from 'date-fns';
import styled from 'styled-components';
import separator from '../images/break/separator.png';
import {CurrentRun} from '../../../types/schemas/currentRun';

const Container = styled.div`
	font-family: 'MigMix 2P';
	color: #2d4273;

	height: 90px;
	box-sizing: border-box;
	padding: 7.5px 22.5px 7.5px 22.5px;

	background-color: #ffffff;
	box-shadow: 4.5px 4.5px 6px -1.5px rgba(0, 0, 0, 1);

	display: flex;
	flex-flow: row nowrap;
	align-items: center;

	border-left: 15px #a7bfff solid;
	&:first-child {
		border-left-color: #4d7dff;
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

const Time = Misc.extend`
	text-align: center;
`;

interface State {
	remainingTime?: string;
}

export class UpcomingRun extends React.Component<CurrentRun, State> {
	public state = {remainingTime: undefined};

	private readonly interval = setInterval(() => {
		this.updateRemainingTime();
	}, 10 * 1000);

	public componentDidMount() {
		this.updateRemainingTime();
	}

	public render() {
		const {props} = this;
		const {title, category} = props;
		const runners =
			props.runners &&
			'Runner: ' + props.runners.map(runner => runner.name).join(', ');
		const misc =
			category && runners
				? /* eslint-disable-next-line no-irregular-whitespace */
				  `${category}　|　${runners}`
				: category || runners;
		return (
			<Container>
				<InfoContainer>
					<Title>{title}</Title>
					<Misc>{misc}</Misc>
				</InfoContainer>
				<img src={separator} />
				<Time>
					あと<br />
					{this.state.remainingTime}
				</Time>
			</Container>
		);
	}

	public componentWillUnmount() {
		clearInterval(this.interval);
	}

	private updateRemainingTime() {
		const {scheduled} = this.props;
		if (!scheduled) {
			return;
		}
		const startsAt = new Date(scheduled);
		const now = new Date();
		this.setState({
			// prettier-ignore
			remainingTime: `${differenceInHours(startsAt, now)}時間${differenceInMinutes(startsAt, now) % 60}分`
		});
	}
}
