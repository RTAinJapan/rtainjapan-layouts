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

// 全ゲーム完了 (閉幕) 状態でタイマー欄に表示する文言。黒枠は Container 側で維持する。
const CompletedNotice = styled("div")({
	gridColumn: "1 / -1",
	gridRow: "1 / -1",
	display: "grid",
	placeItems: "center",
	fontSize: "40px",
	fontWeight: "bold",
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
	const ending = useReplicant("ending");

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

	// 全ゲーム完了 (閉幕) 状態。タイマー欄は黒枠を残したまま「全ゲーム完了」を表示し、
	// 真っ白で「表示されていない (バグ?)」と見えないようにする (#768)。
	if (ending) {
		return (
			<Container>
				<CompletedNotice>全ゲーム完了</CompletedNotice>
			</Container>
		);
	}

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
