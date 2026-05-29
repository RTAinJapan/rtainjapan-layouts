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
// state は replicant に集約し、卓セレクターと ch 入力行で共有する。
const useAudioSlot = (edit: "current" | "next") => {
	const decks = useReplicant("audio-decks");
	const assignment = useReplicant("audio-assignment");
	const slot = assignment?.[edit];
	const writeSlot = (patch: Partial<AudioSlot>) => {
		const cur = assignment ?? {};
		const base = cur[edit] ?? emptySlot();
		assignmentRep.value = {...cur, [edit]: {...base, ...patch}};
	};
	return {decks, slot, writeSlot};
};

const presentOf = (commentators: (Commentator | null)[]) =>
	commentators.filter((c): c is Commentator => Boolean(c && c.name));

// 卓 (A/B) セレクター。モーダル上部に配置。選ぶとテンプレを流し込む。
const AudioDeckSelect: FC<{
	edit: "current" | "next";
	runners: Runner[];
	commentators: (Commentator | null)[];
}> = ({edit, runners, commentators}) => {
	const {decks, slot, writeSlot} = useAudioSlot(edit);
	const presentCommentators = presentOf(commentators);
	const applyDeck = (d: "A" | "B" | "") => {
		if (d === "") {
			writeSlot({deck: null});
			return;
		}
		const tmpl = decks?.[d] ?? {runners: [], commentators: [], games: []};
		writeSlot({
			deck: d,
			runners: runners.map((_, i) => tmpl.runners?.[i] ?? -1),
			games: runners.map((_, i) => tmpl.games?.[i] ?? -1),
			commentators: presentCommentators.map(
				(_, i) => tmpl.commentators?.[i] ?? -1,
			),
		});
	};
	return (
		<div style={{display: "flex", alignItems: "center", gap: 8}}>
			<TypoGraphy variant='body2'>オーディオ卓:</TypoGraphy>
			<select
				value={slot?.deck ?? ""}
				onChange={(e) => applyDeck(e.currentTarget.value as "A" | "B" | "")}
			>
				<option value=''>（未選択）</option>
				<option value='A'>A卓</option>
				<option value='B'>B卓</option>
			</select>
			<TypoGraphy variant='caption' style={{opacity: 0.6}}>
				選ぶと下のオーディオ欄にテンプレを流し込み（個別に上書き可）
			</TypoGraphy>
		</div>
	);
};

// 走者/解説ごとの ch 入力。1人 = 1行のコンパクト表示。
const AudioPersonRows: FC<{
	edit: "current" | "next";
	runners: Runner[];
	commentators: (Commentator | null)[];
}> = ({edit, runners, commentators}) => {
	const {slot, writeSlot} = useAudioSlot(edit);
	const presentCommentators = presentOf(commentators);

	const setCh = (
		kind: "runners" | "commentators" | "games",
		idx: number,
		value: number,
	) => {
		const len =
			kind === "commentators" ? presentCommentators.length : runners.length;
		const curArr = slot?.[kind] ?? [];
		const next: number[] = [];
		for (let i = 0; i < len; i++) next[i] = curArr[i] ?? -1;
		next[idx] = value;
		if (kind === "runners") writeSlot({runners: next});
		else if (kind === "games") writeSlot({games: next});
		else writeSlot({commentators: next});
	};

	const chField = (
		label: string,
		value: number,
		onValue: (n: number) => void,
	) => (
		<TextField
			label={label}
			type='number'
			size='small'
			value={value}
			style={{width: 110}}
			onChange={(e) => {
				const n = parseInt(e.currentTarget.value, 10);
				onValue(Number.isNaN(n) ? -1 : n);
			}}
		/>
	);

	const personRow = (key: string, name: string, fields: React.ReactNode) => (
		<div
			key={key}
			style={{display: "flex", alignItems: "center", gap: 12, minHeight: 48}}
		>
			<div
				style={{
					width: 180,
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
				}}
				title={name}
			>
				{name}
			</div>
			{fields}
		</div>
	);

	return (
		<FormControl>
			<FormLabel>
				<TypoGraphy variant='caption'>
					オーディオ（WING channel-strip 番号 / -1 = 未割当）
				</TypoGraphy>
			</FormLabel>
			<div style={{display: "grid", gridAutoFlow: "row", gap: 4, marginTop: 4}}>
				{runners.map((r, i) =>
					personRow(
						`r${i}`,
						`走者${i + 1} ${r.name}`,
						<>
							{chField("マイク ch", slot?.runners?.[i] ?? -1, (v) =>
								setCh("runners", i, v),
							)}
							{chField("ゲーム音 ch", slot?.games?.[i] ?? -1, (v) =>
								setCh("games", i, v),
							)}
						</>,
					),
				)}
				{presentCommentators.map((c, i) =>
					personRow(
						`c${i}`,
						`解説${i + 1} ${c.name}`,
						chField("マイク ch", slot?.commentators?.[i] ?? -1, (v) =>
							setCh("commentators", i, v),
						),
					),
				)}
			</div>
		</FormControl>
	);
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
					{/* オーディオ卓選択 (run 情報の直下、上部に配置) */}
					{edit && (
						<AudioDeckSelect
							edit={edit}
							runners={run.runners}
							commentators={run.commentators}
						/>
					)}
					{run.runners.map((runner, index) => {
						return (
							<RunnerRow key={runner.pk}>
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
							</RunnerRow>
						);
					})}

					{/* 解説 */}
					{run.commentators.map((maybeCommentator, index) => {
						const commentator = maybeCommentator ?? {
							name: "",
						};
						return (
							<RunnerRow key={index}>
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
							</RunnerRow>
						);
					})}

					{/* オーディオ ch 入力 (1人=1行)。卓選択は上部の AudioDeckSelect。 */}
					{edit && (
						<AudioPersonRows
							edit={edit}
							runners={run.runners}
							commentators={run.commentators}
						/>
					)}
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
