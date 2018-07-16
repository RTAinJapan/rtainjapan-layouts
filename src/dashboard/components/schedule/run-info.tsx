import React from 'react';
import styled from 'styled-components';

import {CurrentRun} from '../../../types/schemas/currentRun';
import {NextRun} from '../../../types/schemas/nextRun';
import {RunnerList} from '../../../types/schemas/runnerList';

const Container = styled.div`
	height: 100%;
	display: grid;
	grid-template-areas: 'label' 'name' 'runners' 'category' 'misc' 'notes';
`;

const Label = styled.div`
	grid-area: 'label';
	font-weight: 500;
	font-size: 18px;
	width: 100;
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
				<div>hoge</div>
				<div>hoge</div>
			</Container>
		);
	}

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
