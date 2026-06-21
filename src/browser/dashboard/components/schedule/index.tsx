import {pink, purple, green, grey} from "@mui/material/colors";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import {styled} from "@mui/material/styles";
import {FC, useState} from "react";
import {useCurrentRun} from "../../../graphics/components/lib/hooks";
import {useReplicant} from "../../../use-replicant";
import {BorderedBox} from "../lib/bordered-box";
import {ColoredButton} from "../lib/colored-button";
import {EditRun} from "./edit";
import {RunInfo} from "./run-info";
import {Typeahead} from "./typeahead";

const Container = styled(BorderedBox)({
	height: "calc(100vh - 32px)",
	padding: "16px",
	display: "grid",
	gridTemplateRows: "auto 1fr",
	gridGap: "12px",
});

const SelectionContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "1fr 50% 1fr",
	gridGap: "8px",
});

const RunInfoContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "1fr 0px 1fr",
	gridGap: "16px",
});

const Divider = styled("div")({
	borderLeft: "1px dashed black",
});

const EditControls = styled("div")({
	display: "grid",
	gridTemplateColumns: "repeat(2, 1fr)",
	gridGap: "16px",
});

// 閉幕表示中は右パネル全体を閉幕用表示に切り替える (最終ゲームの情報は出さない)。
const EndingDisplay = styled("div")({
	display: "grid",
	placeContent: "center",
	justifyItems: "center",
	gap: "16px",
	textAlign: "center",
});

// タイトルは左 (タイマー欄の「全ゲーム完了」) とフォントサイズを合わせる。
const EndingTitle = styled("div")({
	fontSize: "40px",
	fontWeight: "bold",
});

// 補足は少し小さめのキャプション表示。
const EndingHint = styled("div")({
	fontSize: "14px",
	color: grey[600],
});

const moveNextRun = () => {
	nodecg.sendMessage("nextRun");
};

const movePreviousRun = () => {
	nodecg.sendMessage("previousRun");
};

const refreshCurrentRun = () => {
	if (confirm("編集した内容は破棄されます。現在のゲームを更新しますか？")) {
		nodecg.sendMessage("refreshRun", "current");
	}
};

const refreshNextRun = () => {
	if (confirm("編集した内容は破棄されます。次のゲームを更新しますか？")) {
		nodecg.sendMessage("refreshRun", "next");
	}
};

export const Schedule: FC = () => {
	const currentRun = useCurrentRun();
	const nextRun = useReplicant("next-run");
	const [editting, setEditting] = useState<"current" | "next">();
	const schedule = useReplicant("schedule");
	const timer = useReplicant("timer");
	const ending = useReplicant("ending");

	if (!timer || !schedule) {
		return null;
	}

	const disablePrevNextButtons = timer.timerState === "Running";

	const edittingRun = editting === "current" ? currentRun : nextRun;

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
				<Typeahead disabled={disablePrevNextButtons} runs={schedule} />
				<ColoredButton
					color={purple}
					ButtonProps={{
						onClick: moveNextRun,
						// 閉幕表示中は最後のゲームより先が無いので「次」を無効化する。
						disabled: disablePrevNextButtons || !!ending,
					}}
				>
					次<ArrowForward />
				</ColoredButton>
			</SelectionContainer>
			{ending ? (
				<EndingDisplay>
					<EndingTitle>全ゲーム完了</EndingTitle>
					<EndingHint>「前」で最終ゲームに戻る</EndingHint>
				</EndingDisplay>
			) : (
				<RunInfoContainer>
					{currentRun && <RunInfo run={currentRun} label='現在のゲーム' />}
					<Divider />
					{nextRun && <RunInfo run={nextRun} label='次のゲーム' />}
				</RunInfoContainer>
			)}
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
				<ColoredButton color={green} ButtonProps={{onClick: refreshCurrentRun}}>
					現在のゲームを再読み込み
				</ColoredButton>
				<ColoredButton color={green} ButtonProps={{onClick: refreshNextRun}}>
					次のゲームを再読み込み
				</ColoredButton>
			</EditControls>
			{edittingRun && (
				<EditRun
					edit={editting}
					defaultValue={edittingRun}
					onFinish={() => setEditting(undefined)}
				/>
			)}
		</Container>
	);
};
