import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';
import {Run} from '../../../../nodecg/replicants';

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

const LabeledDiv = styled.div`
	white-space: nowrap;
	overflow: hidden;
`;

const RunnersContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	align-items: start;
	justify-content: center;
	grid-gap: 8px;
`;

const MiscContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: start;
	justify-content: center;
`;

export class RunInfo extends React.Component<{
	run: Run;
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
					<Typography variant='caption'>ゲーム</Typography>
					<div>{run.title}</div>
				</LabeledDiv>
				<Divider />
				<RunnersContainer>{this.renderRunners()}</RunnersContainer>
				<Divider />
				<RunnersContainer>{this.renderCommentators()}</RunnersContainer>
				<Divider />
				<LabeledDiv>
					<Typography variant='caption'>カテゴリ</Typography>
					<div>{run.category}</div>
				</LabeledDiv>
				<Divider />
				<MiscContainer>
					<LabeledDiv>
						<Typography variant='caption'>予定時間</Typography>
						<div>{run.runDuration}</div>
					</LabeledDiv>
					<LabeledDiv>
						<Typography variant='caption'>機種</Typography>
						<div>{run.platform}</div>
					</LabeledDiv>
				</MiscContainer>
			</Container>
		);
	}

	private readonly renderRunners = () =>
		this.runners().map((runner, index) => (
			<LabeledDiv key={Math.random()}>
				<Typography variant='caption'>走者{index}</Typography>
				<div>{runner && runner.name}</div>
			</LabeledDiv>
		));

	private readonly renderCommentators = () =>
		this.commentators().map((commentator, index) => (
			<LabeledDiv key={Math.random()}>
				<Typography variant='caption'>解説{index}</Typography>
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
