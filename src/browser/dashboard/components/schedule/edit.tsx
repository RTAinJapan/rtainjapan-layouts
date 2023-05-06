import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import TypoGraphy from "@mui/material/Typography";
import React, {FC, useCallback, useEffect, useState} from "react";
import styled from "@emotion/styled";
import {Commentator, Run, Runner} from "../../../../nodecg/replicants";
import MuiSwitch from "@mui/material/Switch";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import IconUp from "@mui/icons-material/KeyboardArrowUp";
import IconDown from "@mui/icons-material/KeyboardArrowDown";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {cloneDeep} from "lodash";

const Container = styled.div`
	position: absolute;

	overflow: auto;

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	background-color: white;
	box-sizing: border-box;
	padding: 16px;

	display: grid;
	grid-auto-flow: row;
	gap: 8px;
`;

const RunnerRow = styled.div`
	display: grid;
	grid-auto-flow: column;
	gap: 8px;
`;

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
									label={`走者${index + 1} ニコ生`}
									value={runner.nico}
									onChange={(e) => {
										updateRunnerInfo(index, "nico", e.currentTarget.value);
									}}
								/>
								<TextField
									label={`走者${index + 1} Twitter`}
									value={runner.twitter}
									onChange={(e) => {
										updateRunnerInfo(index, "twitter", e.currentTarget.value);
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
						const commentator: Commentator = maybeCommentator ?? {
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
									label={`解説${index + 1} ニコ生`}
									defaultValue={commentator.nico}
									onChange={(e) => {
										updateCommentatorInfo(index, "nico", e.currentTarget.value);
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
							</RunnerRow>
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
