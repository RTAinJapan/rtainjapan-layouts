// Packages
import React from 'react';
import styled from 'styled-components';

// Ours
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {NextRun} from '../../../../types/schemas/nextRun';

const Container = styled.div`
	display: grid;
	grid-auto-flow: row;
	align-content: start;
	align-items: start;
	grid-gap: 16px;
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
	public render() {
		const {run, label} = this.props;
		return (
			<Container>
				<Label>
					{label}&nbsp;(#{run.index})
				</Label>
				<LabeledDiv>
					<label>ゲーム</label>
					<div>{run.title}</div>
				</LabeledDiv>
				<Divider />
				<RunnersContainer>{this.renderRunners()}</RunnersContainer>
				<Divider />
				<RunnersContainer>{this.renderCommentators()}</RunnersContainer>
				<Divider />
				<LabeledDiv>
					<label>カテゴリ</label>
					<div>{run.category}</div>
				</LabeledDiv>
				<Divider />
				<MiscContainer>
					<LabeledDiv>
						<label>予定時間</label>
						<div>{run.duration}</div>
					</LabeledDiv>
					<LabeledDiv>
						<label>機種</label>
						<div>{run.hardware}</div>
					</LabeledDiv>
				</MiscContainer>
				<Divider />
				<LabeledDiv>
					<label>メモ</label>
					<div>N/A</div>
				</LabeledDiv>
			</Container>
		);
	}

	private readonly renderRunners = () =>
		this.runners().map((runner, index) => (
			<LabeledDiv key={Math.random()}>
				<label>走者{index}</label>
				<div>{runner && runner.name}</div>
			</LabeledDiv>
		));

	private readonly renderCommentators = () =>
		this.commentators().map((commentator, index) => (
			<LabeledDiv key={Math.random()}>
				<label>解説{index}</label>
				<div>{commentator && commentator.name}</div>
			</LabeledDiv>
		));

	private readonly runners = () => {
		const {runners} = this.props.run;
		if (!runners) {
			return [];
		}
		return new Array(4).fill(null).map((_, index) => runners[index] || _);
	};

	private readonly commentators = () => {
		const {commentators} = this.props.run;
		if (!commentators) {
			return [];
		}
		return new Array(4)
			.fill(null)
			.map((_, index) => commentators[index] || _);
	};
}
