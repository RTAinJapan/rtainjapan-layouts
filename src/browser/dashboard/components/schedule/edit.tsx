import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import TypoGraphy from "@mui/material/Typography";
import React, {FC, useCallback, useEffect, useState} from "react";
import {createTheme, styled, ThemeProvider} from "@mui/material/styles";
import {Commentator, Run, Runner} from "../../../../nodecg/replicants";
import {useReplicant} from "../../../use-replicant";
import MuiSwitch from "@mui/material/Switch";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import IconUp from "@mui/icons-material/KeyboardArrowUp";
import IconDown from "@mui/icons-material/KeyboardArrowDown";
import {cloneDeep} from "lodash";

const Container = styled("div")({
	position: "absolute",
	overflow: "auto",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	backgroundColor: "white",
	boxSizing: "border-box",
	padding: "16px",
	display: "grid",
	gridAutoFlow: "row",
	gap: "8px",
});

const RunnerRow = styled("div")({
	display: "grid",
	gridAutoFlow: "column",
	gap: "8px",
});

// 走者・解説で列幅を揃えるための共通グリッド行。
// 列: 名前 / Twitch / Twitter / YouTube (4×等幅) / カメラ / マイクch / ゲーム音ch / 並べ替え
// 解説行はカメラ・ゲーム音ch のセルを空 div で埋めて縦位置を揃える。
const PersonRow = styled("div")({
	display: "grid",
	gridTemplateColumns: "repeat(4, minmax(0, 1fr)) 120px 100px 100px 44px",
	gap: "8px",
	alignItems: "center",
});

const Switch: React.FC<{defaultValue: boolean; onChange: Function}> = (
	props,
) => {
	const [enable, setEnable] = React.useState(props.defaultValue);
	return (
		<MuiSwitch
			color='primary'
			checked={enable}
			onChange={() => {
				setEnable((enable) => !enable);
				props.onChange();
			}}
		/>
	);
};

interface Props {
	edit: "current" | "next" | undefined;
	defaultValue: Run;
	onFinish(): void;
}

const theme = createTheme({
	components: {
		MuiTextField: {
			defaultProps: {
				variant: "filled",
			},
		},
		MuiIconButton: {
			defaultProps: {
				size: "small",
			},
		},
		MuiButton: {
			defaultProps: {
				variant: "contained",
			},
		},
	},
});

const assignmentRep = nodecg.Replicant("audio-assignment");

type AudioSlot = {
	deck: "A" | "B" | null;
	runners: number[];
	commentators: number[];
	games: number[];
};
const emptySlot = (): AudioSlot => ({
	deck: null,
	runners: [],
	commentators: [],
	games: [],
});

// audio-assignment の current/next スロットを読み書きするフック。
// 走者/解説の行に統合された ch 入力と、上部の卓セレクターから共有する。
const useAudioSlot = (edit: "current" | "next" | undefined) => {
	const decks = useReplicant("audio-decks");
	const assignment = useReplicant("audio-assignment");
	const slot = edit ? assignment?.[edit] : undefined;
	const writeSlot = (patch: Partial<AudioSlot>) => {
		if (!edit) return;
		const cur = assignment ?? {};
		const base = cur[edit] ?? emptySlot();
		assignmentRep.value = {...cur, [edit]: {...base, ...patch}};
	};
	return {decks, slot, writeSlot};
};

export const EditRun: FC<Props> = ({edit, defaultValue, onFinish}) => {
	const [run, setRun] = useState(() => cloneDeep(defaultValue));

	const updateRunnerInfo = <T extends keyof Runner>(
		updatingIndex: number,
		key: T,
		value: Runner[T] | ((old: Runner[T]) => Runner[T]),
	) => {
		setRun((run) => {
			const oldRunner = run.runners[updatingIndex];
			if (!oldRunner) {
				return run;
			}
			const newRunner = {...oldRunner};
			newRunner[key] =
				typeof value === "function" ? value(oldRunner[key]) : value;
			const newRunners = [...run.runners];
			newRunners[updatingIndex] = newRunner;
			return {...run, runners: newRunners};
		});
	};

	const updateCommentatorInfo = <T extends keyof Commentator>(
		updatingIndex: number,
		key: T,
		value: Commentator[T],
	) => {
		setRun((run) => {
			if (updatingIndex !== 0 && updatingIndex !== 1) {
				return run;
			}
			const oldOne = run.commentators[updatingIndex] ?? {name: ""};
			const newOne = {...oldOne} satisfies Commentator;
			newOne[key] = value;
			const newOnes: [Commentator | null, Commentator | null] = [
				run.commentators[0],
				run.commentators[1],
			];
			newOnes[updatingIndex] = newOne;
			return {...run, commentators: newOnes};
		});
	};

	const swapRunner = useCallback((index1: number, index2: number) => {
		setRun((run) => {
			const newRunners = [...run.runners];
			const runner1 = newRunners[index1];
			const runner2 = newRunners[index2];
			if (runner1 && runner2) {
				newRunners[index1] = runner2;
				newRunners[index2] = runner1;
			}
			return {...run, runners: newRunners};
		});
	}, []);

	const swapCommentator = useCallback((index1: number, index2: number) => {
		setRun((run) => {
			const cs: [Commentator | null, Commentator | null] = [
				run.commentators[0],
				run.commentators[1],
			];
			if (index1 >= 0 && index1 < 2 && index2 >= 0 && index2 < 2) {
				const tmp = cs[index1] ?? null;
				cs[index1] = cs[index2] ?? null;
				cs[index2] = tmp;
			}
			return {...run, commentators: cs};
		});
	}, []);

	const updateClicked = useCallback(async () => {
		if (run) {
			await nodecg.sendMessage("modifyRun", run);
			onFinish();
		}
	}, [run, onFinish]);

	useEffect(() => {
		if (edit) {
			setRun(cloneDeep(defaultValue));
		}
	}, [edit, defaultValue]);

	// --- オーディオ (WING ch) 割り当て。各人の行に統合して表示する ---
	const {
		decks: audioDecks,
		slot: audioSlot,
		writeSlot: writeAudioSlot,
	} = useAudioSlot(edit);

	const applyAudioDeck = (d: "A" | "B" | "") => {
		if (d === "") {
			writeAudioSlot({deck: null});
			return;
		}
		const tmpl = audioDecks?.[d] ?? {runners: [], commentators: [], games: []};
		writeAudioSlot({
			deck: d,
			runners: run.runners.map((_, i) => tmpl.runners?.[i] ?? -1),
			games: run.runners.map((_, i) => tmpl.games?.[i] ?? -1),
			commentators: run.commentators.map(
				(_, i) => tmpl.commentators?.[i] ?? -1,
			),
		});
	};

	const setAudioCh = (
		kind: "runners" | "commentators" | "games",
		idx: number,
		value: number,
	) => {
		const len =
			kind === "commentators" ? run.commentators.length : run.runners.length;
		const curArr = audioSlot?.[kind] ?? [];
		const next: number[] = [];
		for (let i = 0; i < len; i++) next[i] = curArr[i] ?? -1;
		next[idx] = value;
		if (kind === "runners") writeAudioSlot({runners: next});
		else if (kind === "games") writeAudioSlot({games: next});
		else writeAudioSlot({commentators: next});
	};

	const audioChField = (
		label: string,
		value: number,
		onValue: (n: number) => void,
	) => (
		<TextField
			label={label}
			type='number'
			size='small'
			fullWidth
			value={value}
			onChange={(e) => {
				const n = parseInt(e.currentTarget.value, 10);
				onValue(Number.isNaN(n) ? -1 : n);
			}}
		/>
	);

	return (
		<ThemeProvider theme={theme}>
			<Modal open={Boolean(edit)}>
				<Container>
					<RunnerRow>
						<TextField
							value={run.title}
							label='タイトル'
							onChange={({currentTarget: {value}}) => {
								setRun((run) => (run ? {...run, title: value} : run));
							}}
						/>
						<TextField
							value={run.category}
							label='カテゴリ'
							onChange={({currentTarget: {value}}) => {
								setRun((run) => (run ? {...run, category: value} : run));
							}}
						/>
					</RunnerRow>
					<RunnerRow>
						<TextField
							value={run.runDuration}
							label='予定タイム'
							onChange={({currentTarget: {value}}) => {
								setRun((run) => (run ? {...run, runDuration: value} : run));
							}}
						/>
						<TextField
							value={run.platform}
							label='機種'
							onChange={({currentTarget: {value}}) => {
								setRun((run) => (run ? {...run, platform: value} : run));
							}}
						/>
						<TextField
							value={run.releaseYear}
							label='発売年'
							onChange={({currentTarget: {value}}) => {
								setRun((run) =>
									run ? {...run, releaseYear: parseInt(value)} : run,
								);
							}}
						/>
					</RunnerRow>
					{/* オーディオ卓選択 (右上)。選ぶと各人の行 ch 欄にテンプレを流し込む */}
					{edit && (
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
								gap: 8,
								flexWrap: "wrap",
							}}
						>
							<TypoGraphy variant='body2'>オーディオ卓:</TypoGraphy>
							<select
								value={audioSlot?.deck ?? ""}
								onChange={(e) =>
									applyAudioDeck(e.currentTarget.value as "A" | "B" | "")
								}
							>
								<option value=''>（未選択）</option>
								<option value='A'>A卓</option>
								<option value='B'>B卓</option>
							</select>
							<TypoGraphy variant='caption' style={{opacity: 0.6}}>
								WING channel-strip 番号 / -1 = 未割当
							</TypoGraphy>
						</div>
					)}
					{run.runners.map((runner, index) => {
						return (
							<PersonRow key={runner.pk}>
								<TextField
									label={`走者${index + 1} 名前`}
									value={runner.name}
									onChange={(e) => {
										updateRunnerInfo(index, "name", e.currentTarget.value);
									}}
								/>
								<TextField
									label={`走者${index + 1} Twitch`}
									value={runner.twitch}
									onChange={(e) => {
										updateRunnerInfo(index, "twitch", e.currentTarget.value);
									}}
								/>
								<TextField
									label={`走者${index + 1} Twitter`}
									value={runner.twitter}
									onChange={(e) => {
										updateRunnerInfo(index, "twitter", e.currentTarget.value);
									}}
								/>
								<TextField
									label={`走者${index + 1} YouTube`}
									value={runner.youtube}
									onChange={(e) => {
										updateRunnerInfo(index, "youtube", e.currentTarget.value);
									}}
								/>
								<FormControl>
									<FormLabel>
										<TypoGraphy variant={"caption"}>
											走者{index + 1}カメラ
										</TypoGraphy>
									</FormLabel>
									<div
										style={{
											display: "grid",
											gridAutoFlow: "column",
											placeItems: "center",
										}}
									>
										<VideocamOffIcon />
										<Switch
											defaultValue={Boolean(runner.camera)}
											onChange={() => {
												// TODO: should prevent stale state reference
												updateRunnerInfo(index, "camera", (camera) => !camera);
											}}
										/>
										<VideocamIcon color={"secondary"} />
									</div>
								</FormControl>
								{audioChField(
									"マイク ch",
									audioSlot?.runners?.[index] ?? -1,
									(v) => setAudioCh("runners", index, v),
								)}
								{audioChField(
									"ゲーム音 ch",
									audioSlot?.games?.[index] ?? -1,
									(v) => setAudioCh("games", index, v),
								)}
								<div
									style={{
										placeSelf: "center",
										display: "grid",
										gridTemplateRows: "1fr 1fr",
									}}
								>
									{index !== 0 && (
										<IconButton
											style={{gridRow: "1 / 2"}}
											onClick={() => {
												swapRunner(index, index - 1);
											}}
										>
											<IconUp />
										</IconButton>
									)}
									{index !== run.runners.length - 1 && (
										<IconButton
											style={{gridRow: "2 / 3"}}
											onClick={() => {
												swapRunner(index, index + 1);
											}}
										>
											<IconDown />
										</IconButton>
									)}
								</div>
							</PersonRow>
						);
					})}

					{/* 解説 */}
					{run.commentators.map((maybeCommentator, index) => {
						const commentator = maybeCommentator ?? {
							name: "",
						};
						return (
							<PersonRow key={index}>
								<TextField
									label={`解説${index + 1} 名前`}
									defaultValue={commentator.name}
									onChange={(e) => {
										updateCommentatorInfo(index, "name", e.currentTarget.value);
									}}
								/>
								<TextField
									label={`解説${index + 1} Twitch`}
									defaultValue={commentator.twitch}
									onChange={(e) => {
										updateCommentatorInfo(
											index,
											"twitch",
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`解説${index + 1} Twitter`}
									defaultValue={commentator.twitter}
									onChange={(e) => {
										updateCommentatorInfo(
											index,
											"twitter",
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`解説${index + 1} YouTube`}
									defaultValue={commentator.youtube}
									onChange={(e) => {
										updateCommentatorInfo(
											index,
											"youtube",
											e.currentTarget.value,
										);
									}}
								/>
								{/* カメラ列は解説に無いので空セルで揃える */}
								<div />
								{/* 解説不在でもマイク ch 欄は常に表示し、走者と縦位置を揃える */}
								{audioChField(
									"マイク ch",
									audioSlot?.commentators?.[index] ?? -1,
									(v) => setAudioCh("commentators", index, v),
								)}
								{/* ゲーム音 ch 列は解説に無いので空セル */}
								<div />
								<div
									style={{
										placeSelf: "center",
										display: "grid",
										gridTemplateRows: "1fr 1fr",
									}}
								>
									{index !== 0 && (
										<IconButton
											style={{gridRow: "1 / 2"}}
											onClick={() => {
												swapCommentator(index, index - 1);
											}}
										>
											<IconUp />
										</IconButton>
									)}
									{index !== run.commentators.length - 1 && (
										<IconButton
											style={{gridRow: "2 / 3"}}
											onClick={() => {
												swapCommentator(index, index + 1);
											}}
										>
											<IconDown />
										</IconButton>
									)}
								</div>
							</PersonRow>
						);
					})}

					<div
						style={{
							placeSelf: "end",
							display: "grid",
							gridAutoFlow: "column",
							gap: "8px",
						}}
					>
						<Button onClick={updateClicked}>更新</Button>
						<Button onClick={onFinish}>キャンセル</Button>
					</div>
				</Container>
			</Modal>
		</ThemeProvider>
	);
};
