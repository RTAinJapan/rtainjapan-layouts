import React from 'react';
import runnerIcon from '../images/icon/runner.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {BaseNameplate} from './lib/base-nameplate';

export class RtaijRunner extends BaseNameplate {
	applyCurrentRunChangeToState = (newVal: CurrentRun) => {
		this.setState({
			runners: newVal.runners,
		});
	};
	iconPath = runnerIcon;
	label = 'Runner';

	render() {
		const Container = this.Container;
		return (
			<Container>
				<div>1:23:45</div>
			</Container>
		);
	}
}
