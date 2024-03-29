import green from "@mui/material/colors/green";
import grey from "@mui/material/colors/grey";
import orange from "@mui/material/colors/orange";
import pink from "@mui/material/colors/pink";
import Edit from "@mui/icons-material/Edit";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Refresh from "@mui/icons-material/Refresh";
import {FC, useEffect, useState} from "react";
import styled from "styled-components";
import {v4 as uuidv4} from "uuid";
import {useTimer} from "../../../graphics/components/lib/hooks";
import {useReplicant} from "../../../use-replicant";
import {BorderedBox} from "../lib/bordered-box";
import {ColoredButton} from "../lib/colored-button";
import {EditTimeModal} from "./edit";
import {Runner} from "./runner";

const Container = styled(BorderedBox)`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: 105px 1fr;
	grid-template-areas: "timer ctrls" "runners runners";
	justify-items: center;
	align-items: center;
`;

const Timer = styled.div`
	grid-area: timer;
	padding: 0 16px;
	font-size: 55px;
`;

const CtrlsContainer = styled.div`
	padding-right: 16px;
	grid-area: ctrls;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	grid-gap: 8px;
	justify-items: center;
	align-items: center;
`;

const RunnersContainer = styled.div`
	justify-self: stretch;
	align-self: stretch;
	grid-area: runners;
	display: grid;
	grid-template-rows: repeat(4, 1fr);
`;

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
