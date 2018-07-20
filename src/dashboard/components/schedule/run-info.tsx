import React from 'react';
import styled from 'styled-components';

import {CurrentRun} from '../../../types/schemas/currentRun';
import {NextRun} from '../../../types/schemas/nextRun';
import {RunnerList} from '../../../types/schemas/runnerList';

const Container = styled.div`
	display: grid;
`;

const Label = styled.div`
	text-align: center;
`;

export class RunInfo extends React.Component<{
	run: CurrentRun | NextRun;
	label: string;
}> {
	render() {
		return (
			<Container>
				<Label>
					{this.props.label}&nbsp;(#{this.props.run.index})
				</Label>
				{this.renderRunners()}
			</Container>
		);
	}

	private readonly renderRunners = () =>
		this.runners().map(runner => (
			<div key={runner.name}>{runner.name}</div>
		));
	private readonly runners = () => {
		const runners: RunnerList = [];
		if (this.props.run.runners) {
			for (const runner of this.props.run.runners) {
				if (runner) {
					runners.push(runner);
				}
			}
		}
		return runners;
	};
}
