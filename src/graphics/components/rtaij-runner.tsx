import React from 'react';
import {FinishTime} from './lib/nameplate';
import runnerIcon from '../images/icon/runner.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {BaseNameplate} from './lib/base-nameplate';

export class RtaijRunner extends BaseNameplate {
	currentRunChangeHandler = (newVal: CurrentRun) => {
		this.setState({
			runners: newVal.runners,
		});
	};
	iconPath = runnerIcon;
	rootId = 'runner';
	label = 'Runner';

	render() {
		const Container = this.Container;
		return (
			<Container>
				<FinishTime>finish time</FinishTime>
			</Container>
		);
	}
}
