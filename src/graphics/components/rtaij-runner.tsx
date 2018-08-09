import React from 'react';
import runnerIcon from '../images/icon/runner.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {Nameplate} from './lib/nameplate';

export class RtaijRunner extends Nameplate {
	public labelIcon = runnerIcon;

	public label = 'Runner';

	public applyCurrentRunChangeToState = (newVal: CurrentRun) => {
		this.setState({
			runners: newVal.runners,
		});
	};

	public render() {
		const {Container} = this;
		return <Container />;
	}
}
