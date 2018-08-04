import React from 'react';
import runnerIcon from '../images/icon/runner.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {BaseNameplate} from './lib/base-nameplate';

export class RtaijRunner extends BaseNameplate {
	public iconPath = runnerIcon;
	public label = 'Runner';
	public applyCurrentRunChangeToState = (newVal: CurrentRun) => {
		this.setState({
			runners: newVal.runners,
		});
	};

	public render() {
		const Container = this.Container;
		return (
			<Container>
				<div>1:23:45</div>
			</Container>
		);
	}
}
