import Edit from "@mui/icons-material/Edit";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Refresh from "@mui/icons-material/Refresh";
import {styled} from "@mui/material/styles";
import {FC, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {useTimer} from "../../../graphics/components/lib/hooks";
import {useReplicant} from "../../../use-replicant";
import {BorderedBox} from "../lib/bordered-box";
import {ColoredButton} from "../lib/colored-button";
import {EditTimeModal} from "./edit";
import {Runner} from "./runner";
import {green, grey, orange, pink} from "@mui/material/colors";

const Container = styled(BorderedBox)({
	display: "grid",
	gridTemplateColumns: "1fr auto",
	gridTemplateRows: "105px 1fr",
	gridTemplateAreas: '"timer ctrls" "runners runners"',
	justifyItems: "center",
	alignItems: "center",
});

const Timer = styled("div")({
	gridArea: "timer",
	padding: "0 16px",
	fontSize: "55px",
});

const CtrlsContainer = styled("div")({
	paddingRight: "16px",
	gridArea: "ctrls",
	display: "grid",
	gridTemplateColumns: "repeat(2, 1fr)",
	gridTemplateRows: "repeat(2, 1fr)",
	gridGap: "8px",
	justifyItems: "center",
	alignItems: "center",
});

const RunnersContainer = styled("div")({
	justifySelf: "stretch",
	alignSelf: "stretch",
	gridArea: "runners",
	display: "grid",
	gridTemplateRows: "repeat(4, 1fr)",
});

const startTimer = () => {
	nodecg.sendMessage("startTimer", undefined);
};

const stopTimer = () => {
	nodecg.sendMessage("stopTimer");
};

const resetTimer = () => {
	if (confirm("本当にタイマーをリセットしますか?")) {
		nodecg.sendMessage("resetTimer");
	}
};

type Runner = {
	id: string;
	name: string;
};

export const Timekeeper: FC = () => {
	const timer = useTimer();
	const currentRun = useReplicant("current-run");
	const checklist = useReplicant("checklist");

	const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

	const [runners, setRunners] = useState<Runner[]>([]);

	useEffect(() => {
		setRunners(
			Array.from({length: 4}).map((_, index) => ({
				name: currentRun?.runners[index]?.name || "",
				id: uuidv4(),
			})),
		);
	}, [currentRun]);

	if (!currentRun || !checklist || !timer) {
		return null;
	}

	const checklistPks = checklist.map((check) => check.pk);
	const completedChecklist = currentRun.completedChecklist;
	const checklistComplete = checklistPks.every((pk) =>
		completedChecklist.includes(pk),
	);

	// Disable start if checklist is not completed or timer is not stopped state
	const shouldDisableStart =
		!checklistComplete || timer.timerState !== "Stopped";

	// Disable pause if timer is not running
	const shouldDisablePause = timer.timerState !== "Running";

	const closeModal = (value?: string) => {
		if (value) {
			nodecg.sendMessage("editTime", {index: "master", newTime: value});
		}
		setIsModalOpened(false);
	};

	const openEdit = () => {
		setIsModalOpened(true);
	};

	return (
		<Container>
			<Timer>{timer.formatted}</Timer>
			<CtrlsContainer>
				<ColoredButton
					color={green}
					ButtonProps={{
						disabled: shouldDisableStart,
						onClick: startTimer,
						fullWidth: true,
					}}
				>
					<PlayArrow />
					開始
				</ColoredButton>
				<ColoredButton
					color={orange}
					ButtonProps={{
						disabled: shouldDisablePause,
						onClick: stopTimer,
						fullWidth: true,
					}}
				>
					<Pause />
					停止
				</ColoredButton>
				<ColoredButton
					color={pink}
					ButtonProps={{
						onClick: resetTimer,
						fullWidth: true,
					}}
				>
					<Refresh />
					リセット
				</ColoredButton>
				<ColoredButton
					color={grey}
					ButtonProps={{
						onClick: openEdit,
						fullWidth: true,
					}}
				>
					<Edit />
					編集
				</ColoredButton>
			</CtrlsContainer>
			<RunnersContainer>
				{runners.map((runner, index) => (
					<Runner
						key={runner.id}
						checklistCompleted={checklistComplete}
						index={index}
						runner={runner.name}
						timer={timer}
					/>
				))}
			</RunnersContainer>

			<EditTimeModal
				open={isModalOpened}
				defaultValue={timer.formatted}
				onFinish={closeModal}
			/>
		</Container>
	);
};
