import Typography from "@mui/material/Typography";
import {FC} from "react";
import {styled} from "@mui/material/styles";
import {Run} from "../../../../nodecg/replicants";

const Container = styled("div")({
	display: "grid",
	gridAutoFlow: "row",
	alignContent: "start",
	alignItems: "start",
	gridGap: "16px",
});

const Divider = styled("div")({
	borderTop: "1px dashed black",
});

const Label = styled("div")({
	textAlign: "center",
});

const LabeledDiv = styled("div")({
	whiteSpace: "nowrap",
	overflow: "hidden",
});

const RunnersContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "repeat(2, 1fr)",
	gridTemplateRows: "repeat(2, 1fr)",
	alignItems: "start",
	justifyContent: "center",
	gridGap: "8px",
});

const MiscContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "repeat(2, 1fr)",
	alignItems: "start",
	justifyContent: "center",
});

export const RunInfo: FC<{run: Run; label: string}> = ({run, label}) => {
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
			<LabeledDiv>
				<Typography variant='caption'>カテゴリ</Typography>
				<div>{run.category}</div>
			</LabeledDiv>
			<Divider />
			<RunnersContainer>
				{run.runners.map((runner, index) => (
					<LabeledDiv key={`runner${runner?.name}${index}`}>
						<Typography variant='caption'>走者{index + 1}</Typography>
						<div>{runner && runner.name}</div>
					</LabeledDiv>
				))}
			</RunnersContainer>
			<Divider />
			<RunnersContainer>
				{run.commentators.map((commentator, index) => (
					<LabeledDiv key={`commentator${commentator?.name}${index}`}>
						<Typography variant='caption'>解説{index + 1}</Typography>
						<div>{commentator && commentator.name}</div>
					</LabeledDiv>
				))}
			</RunnersContainer>
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
