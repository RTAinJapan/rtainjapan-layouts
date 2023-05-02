import pink from "@material-ui/core/colors/pink";
import purple from "@material-ui/core/colors/purple";
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import {FC, useState} from "react";
import styled from "styled-components";
import {useCurrentRun} from "../../../graphics/components/lib/hooks";
import {useReplicant} from "../../../use-replicant";
import {BorderedBox} from "../lib/bordered-box";
import {ColoredButton} from "../lib/colored-button";
import {EditRun} from "./edit";
import {RunInfo} from "./run-info";
import {Typeahead} from "./typeahead";

const Container = styled(BorderedBox)`
	height: calc(100vh - 32px);
	padding: 16px;
	display: grid;
	grid-template-rows: auto 1fr;
	grid-gap: 12px;
`;

const SelectionContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 50% 1fr;
	grid-gap: 8px;
`;

const RunInfoContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 0px 1fr;
	grid-gap: 16px;
`;

const Divider = styled.div`
	border-left: 1px dashed black;
`;

const EditControls = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 16px;
`;

const moveNextRun = () => {
	nodecg.sendMessage("nextRun");
};

const movePreviousRun = () => {
	nodecg.sendMessage("previousRun");
};

export const Schedule: FC = () => {
	const currentRun = useCurrentRun();
	const nextRun = useReplicant("next-run");
	const [editting, setEditting] = useState<"current" | "next">();
	const schedule = useReplicant("schedule");
	const timer = useReplicant("timer");

	if (!timer || !schedule) {
		return null;
	}

	const titles = schedule.map((run) => run.title);
	const disablePrevNextButtons = timer.timerState === "Running";

	return (
		<Container>
			<SelectionContainer>
				<ColoredButton
					color={purple}
					ButtonProps={{
						onClick: movePreviousRun,
						disabled: disablePrevNextButtons,
					}}
				>
					<ArrowBack />前
				</ColoredButton>
				<Typeahead disabled={disablePrevNextButtons} titles={titles} />
				<ColoredButton
					color={purple}
					ButtonProps={{
						onClick: moveNextRun,
						disabled: disablePrevNextButtons,
					}}
				>
					次<ArrowForward />
				</ColoredButton>
			</SelectionContainer>
			<RunInfoContainer>
				{currentRun && <RunInfo run={currentRun} label='現在のゲーム' />}
				<Divider />
				{nextRun && <RunInfo run={nextRun} label='次のゲーム' />}
			</RunInfoContainer>
			<EditControls>
				<ColoredButton
					color={pink}
					ButtonProps={{onClick: () => setEditting("current")}}
				>
					編集：現在のゲーム
				</ColoredButton>
				<ColoredButton
					color={pink}
					ButtonProps={{onClick: () => setEditting("next")}}
				>
					編集：次のゲーム
				</ColoredButton>
			</EditControls>
			<EditRun
				edit={editting}
				defaultValue={
					(editting === "current" ? currentRun : nextRun) || undefined
				}
				onFinish={() => setEditting(undefined)}
			/>
		</Container>
	);
};
