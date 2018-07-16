import React from 'react';
import styled from 'styled-components';
import cloneDeep from 'lodash/cloneDeep'
import {stopwatchRep, currentRunRep, checklistCompleteRep} from '../../replicants';
import { TimeObject, TimerState } from '../../../lib/time-object';

const Container = styled.div`
	margin: 16px;
	font-weight: 700;
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: 105px 1fr;
	grid-area: 'timer ctrls' 'runners';
`;

const Timer = styled.div`
	grid-area: 'timer';
	font-size: 55px;
	text-align: center;
`;

export class Timekeeper extends React.Component<
	{},
	{timer: TimeObject; runners: (string | null)[]; checklistComplete: boolean}
> {
	constructor(props: {}) {
		super(props);
		this.state = {timer: new TimeObject(0), runners: [], checklistComplete: false}
		stopwatchRep.on('change', newVal => {
			this.setState({
				...this.state,
				timer: cloneDeep(newVal)
			})
		});
		currentRunRep.on('change', newVal => {
			const runners: (string | null)[] = [null, null, null, null]
			if (newVal.runners) {
				newVal.runners.slice(0, 4).forEach((runner, index) => {
					if (runner) {
						runners[index] = runner.name || ''
					}
				})
			}
			this.setState({
				...this.state,
				runners
			})
		})
		checklistCompleteRep.on('change', newVal => {
			if (newVal === this.state.checklistComplete) {
				return;
			}
			this.setState({
				...this.state,
				checklistComplete: newVal
			})
		})
	}

	render() {
		return (
			<Container>
				<Timer>{this.state.timer.formatted}</Timer>
				<div>hoge</div>
				<div>hoge</div>
				<div>hoge</div>
				<div>hoge</div>
				<div>hoge</div>
			</Container>
		);
	}

	private paused = () => this.state.timer.timerState === TimerState.Stopped && this.state.timer.raw > 0
}
