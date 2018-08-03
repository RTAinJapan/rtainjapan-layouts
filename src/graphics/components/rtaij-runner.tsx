import React from 'react';
import styled from 'styled-components';
import runnerIcon from '../images/icon/runner.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {BaseNameplate} from './lib/base-nameplate';

const FinishTime = styled.div`
	position: absolute;
	right: 15px;
	bottom: 8px;
	color: #ffff52;
	opacity: 0;
	transition: opacity 0.33s linear;
	font-size: 30px;
`;

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
				<FinishTime>finish time</FinishTime>
			</Container>
		);
	}
}
