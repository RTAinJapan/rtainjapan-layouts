import React from 'react';
import styled from 'styled-components';

import {CurrentRun} from '../../../types/schemas/currentRun';
import {NextRun} from '../../../types/schemas/nextRun';
import {RunnerList} from '../../../types/schemas/runnerList';

const Container = styled.div`
	display: grid;
	grid-template-rows: repeat(10, auto);
	align-content: start;
	align-items: start;
	gap: 16px;
`;

const Divider = styled.div`
	border-top: 1px dashed black;
`;

const Label = styled.div`
	text-align: center;
`;

const LabeledDiv = styled.div``;

const RunnersContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	align-items: start;
	justify-content: center;
`;

const MiscContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: start;
	justify-content: center;
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
				<LabeledDiv>
					<label>ゲーム</label>
					<div>{this.props.run.title}</div>
				</LabeledDiv>
				<Divider />
				<RunnersContainer>{this.renderRunners()}</RunnersContainer>
				<Divider />
				<LabeledDiv>
					<label>カテゴリ</label>
					<div>{this.props.run.category}</div>
				</LabeledDiv>
				<Divider />
				<MiscContainer>
					<LabeledDiv>
						<label>予定時間</label>
						<div>{this.props.run.duration}</div>
					</LabeledDiv>
					<LabeledDiv>
						<label>機種</label>
						<div>{this.props.run.hardware}</div>
					</LabeledDiv>
				</MiscContainer>
				<Divider />
				<LabeledDiv>
					<label>メモ</label>
					<div>hogehoge</div>
				</LabeledDiv>
			</Container>
		);
	}

	private readonly renderRunners = () =>
		this.runners().map((runner, index) => (
			<LabeledDiv key={index}>
				<label>走者{index}</label>
				<div>{runner && runner.name}</div>
			</LabeledDiv>
		));

	private readonly runners = () => {
		const runners = this.props.run.runners;
		if (!runners) {
			return [];
		}
		return Array(4)
			.fill(null)
			.map((_, index) => runners[index] || _);
	};
}
