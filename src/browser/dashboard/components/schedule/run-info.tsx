import Typography from "@material-ui/core/Typography";
import {FC} from "react";
import styled from "styled-components";
import {Run} from "../../../../nodecg/replicants";

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

export const RunInfo: FC<{run: Run; label: string}> = ({run, label}) => {
	const runners = Array.from({length: 4}).map(
		(_, index) => run.runners[index] ?? null,
	);
	const commentators = Array.from({length: 2}).map(
		(_, index) => run.commentators[index] ?? null,
	);

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
			<RunnersContainer>
				{runners.map((runner, index) => (
					<LabeledDiv key={`runner${runner?.name}${index}`}>
						<Typography variant='caption'>走者{index + 1}</Typography>
						<div>{runner && runner.name}</div>
					</LabeledDiv>
				))}
			</RunnersContainer>
			<Divider />
			<RunnersContainer>
				{commentators.map((commentator, index) => (
					<LabeledDiv key={`commentator${commentator?.name}${index}`}>
						<Typography variant='caption'>解説{index + 1}</Typography>
						<div>{commentator && commentator.name}</div>
					</LabeledDiv>
				))}
			</RunnersContainer>
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
};
