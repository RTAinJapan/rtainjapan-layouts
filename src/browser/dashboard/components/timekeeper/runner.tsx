import {blueGrey, green, grey} from "@mui/material/colors";
import Cancel from "@mui/icons-material/Cancel";
import Edit from "@mui/icons-material/Edit";
import Flag from "@mui/icons-material/Flag";
import Undo from "@mui/icons-material/Undo";
import {styled} from "@mui/material/styles";
import {FC, useState} from "react";
import {Timer} from "../../../../nodecg/replicants";
import {ColoredButton} from "../lib/colored-button";
import {EditTimeModal} from "./edit";

const Container = styled("div")<{index: number}>(({index}) => ({
	padding: "0 16px",
	display: "grid",
	alignItems: "center",
	...(index % 2 === 0 && {
		backgroundColor: "#dedede",
	}),
}));

const RunnerContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "1fr auto",
	gridTemplateAreas: '"runner button"',
});

const RunnerName = styled("div")({
	fontSize: "24px",
});

const RunnerStatus = styled("div")<{finished: boolean}>(({finished}) => ({
	fontSize: "24px",
	color: "#adadad",
	...(finished && {
		color: "#43ac6a",
	}),
}));

const ButtonContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "repeat(3, 80px)",
	gridGap: "8px",
	justifyItems: "stretch",
	alignItems: "center",
});

const EmptySlot = styled("div")({
	fontSize: "24px",
	color: "#adadad",
	textAlign: "center",
});

type Props = {
	runner: string | undefined;
	checklistCompleted: boolean;
	timer: Timer;
	index: number;
};

export const Runner: FC<Props> = (props) => {
	const [isModalOpened, setIsModalOpened] = useState(false);

	if (!props.runner) {
		return (
			<Container index={props.index}>
				<EmptySlot>― EMPTY SLOT ―</EmptySlot>
			</Container>
		);
	}

	const result = props.timer.results[props.index];
	const shouldShowResume = Boolean(result);
	const shouldDisableEdit = !shouldShowResume;
	const shouldShowFinish = Boolean(!result || result["forfeit"]);
	const shouldShowForfeit = Boolean(!result || !result["forfeit"]);
	const status = result ? result.formatted : "Running";
	const defaultEditValue = result ? result.formatted : "00:00";
	const timerIsZero = props.timer.raw === 0;

	return (
		<Container index={props.index}>
			<RunnerContainer>
				<div>
					<RunnerName>{props.runner}</RunnerName>
					<RunnerStatus finished={!shouldShowFinish}>{status}</RunnerStatus>
				</div>
				<ButtonContainer>
					{shouldShowFinish && (
						<ColoredButton
							color={green}
							ButtonProps={{
								fullWidth: true,
								onClick: () => {
									nodecg.sendMessage("completeRunner", {
										index: props.index,
										forfeit: false,
									});
								},
								disabled: timerIsZero,
							}}
						>
							<Flag />
							完走
						</ColoredButton>
					)}
					{shouldShowResume && (
						<ColoredButton
							color={green}
							ButtonProps={{
								fullWidth: true,
								onClick: () => {
									nodecg.sendMessage("resumeRunner", props.index);
								},
								disabled: timerIsZero,
							}}
						>
							<Undo />
							再開
						</ColoredButton>
					)}
					{shouldShowForfeit && (
						<ColoredButton
							color={blueGrey}
							ButtonProps={{
								fullWidth: true,
								onClick: () => {
									nodecg.sendMessage("completeRunner", {
										index: props.index,
										forfeit: true,
									});
								},
								disabled: timerIsZero,
							}}
						>
							<Cancel />
							リタイア
						</ColoredButton>
					)}
					<ColoredButton
						color={grey}
						ButtonProps={{
							fullWidth: true,
							onClick: () => {
								setIsModalOpened(true);
							},
							disabled: shouldDisableEdit,
						}}
					>
						<Edit />
						編集
					</ColoredButton>
				</ButtonContainer>
				<EditTimeModal
					defaultValue={defaultEditValue}
					open={isModalOpened}
					onFinish={(value?: string) => {
						if (value) {
							nodecg.sendMessage("editTime", {
								index: props.index,
								newTime: value,
							});
						}
						setIsModalOpened(false);
					}}
				/>
			</RunnerContainer>
		</Container>
	);
};
