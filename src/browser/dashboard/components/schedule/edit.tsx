import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import TypoGraphy from "@mui/material/Typography";
import max from "lodash/max";
import React, {FC, useEffect, useState} from "react";
import styled from "styled-components";
import {Participant, Run} from "../../../../nodecg/replicants";
import MuiSwitch from "@mui/material/Switch";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const Container = styled.div`
	position: absolute;

	max-height: 100vh;
	max-width: 100vw;
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
	display: flex;
	flex-flow: row nowrap;
	gap: 8px;
`;

const CameraControl = styled.div`
	display: flex;
	flex-flow: row nowrap;
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
	defaultValue?: Run;
	onFinish(): void;
}

export const EditRun: FC<Props> = ({edit, defaultValue, onFinish}) => {
	const [run, setRun] = useState(defaultValue);

	const updateRunnerInfo = <T extends keyof Participant>(
		updatingIndex: number,
		key: T,
		value: Participant[T],
	) => {
		setRun((run) => {
			if (!run?.runners) {
				return run;
			}
			// 固定値で4行表示してるので、対象のindexのoldが取得できないこともある
			const oldRunner: Partial<(typeof run.runners)[0]> = run.runners[
				updatingIndex
			] || {name: ""};
			const newRunner = {name: "", ...oldRunner, [key]: value};
			const newRunners: Participant[] = [];
			const iterateLength =
				(max([updatingIndex, run.runners.length - 1]) || 0) + 1;
			for (let i = 0; i < iterateLength; i++) {
				if (i === updatingIndex) {
					newRunners.push(newRunner);
				} else {
					newRunners.push(run.runners[i] || {name: ""});
				}
			}
			return {...run, runners: newRunners};
		});
	};

	const updateCommentatorInfo = <T extends keyof Participant>(
		updatingIndex: number,
		key: T,
		value: Participant[T],
	) => {
		setRun((run) => {
			if (!run?.commentators) {
				return run;
			}
			const oldOne = run.commentators[updatingIndex] ?? {name: ""};
			const newOne = {...oldOne, [key]: value};
			const newOnes: Participant[] = [];
			const iterateLength =
				(max([updatingIndex, run.commentators.length - 1]) || 0) + 1;
			for (let i = 0; i < iterateLength; i++) {
				if (i === updatingIndex) {
					newOnes.push(newOne);
				} else {
					newOnes.push(run.commentators[i] || {name: ""});
				}
			}
			return {...run, commentators: newOnes};
		});
	};

	const finish = () => {
		onFinish();
	};

	const updateClicked = async () => {
		if (run) {
			await nodecg.sendMessage("modifyRun", run);
			finish();
		}
	};

	useEffect(() => {
		if (edit) {
			setRun(defaultValue);
		}
	}, [edit, defaultValue]);

	if (!defaultValue) {
		return null;
	}

	const runners = defaultValue.runners || [];
	const commentators = defaultValue.commentators || [];

	return (
		<Modal
			aria-labelledby='simple-modal-title'
			aria-describedby='simple-modal-description'
			open={Boolean(edit)}
		>
			<Container>
				<TypoGraphy variant='h4'>
					{edit === "current" ? "現在の" : "次の"}
					ゲームを編集
				</TypoGraphy>
				<TextField
					defaultValue={defaultValue.title}
					label='タイトル'
					onChange={({currentTarget: {value}}) => {
						setRun((run) => (run ? {...run, title: value} : run));
					}}
				/>
				<TextField
					defaultValue={defaultValue.category}
					label='カテゴリ'
					onChange={({currentTarget: {value}}) => {
						setRun((run) => (run ? {...run, category: value} : run));
					}}
				/>
				<RunnerRow>
					<TextField
						defaultValue={defaultValue.runDuration}
						label='予定タイム'
						onChange={({currentTarget: {value}}) => {
							setRun((run) => (run ? {...run, runDuration: value} : run));
						}}
					/>
					<TextField
						defaultValue={defaultValue.platform}
						label='機種'
						onChange={({currentTarget: {value}}) => {
							setRun((run) => (run ? {...run, platform: value} : run));
						}}
					/>
					<TextField
						defaultValue={defaultValue.releaseYear}
						label='発売年'
						onChange={({currentTarget: {value}}) => {
							setRun((run) =>
								run ? {...run, releaseYear: parseInt(value)} : run,
							);
						}}
					/>
				</RunnerRow>
				{Array.from({length: 4}, (_, index) => {
					const runner: Participant = runners[index] || {name: ""};
					return (
						<RunnerRow key={index}>
							<TextField
								label={`走者${index + 1} 名前`}
								defaultValue={runner.name}
								onChange={(e) => {
									updateRunnerInfo(index, "name", e.currentTarget.value);
								}}
							/>
							<TextField
								label={`走者${index + 1} Twitch`}
								defaultValue={runner.twitch}
								onChange={(e) => {
									updateRunnerInfo(index, "twitch", e.currentTarget.value);
								}}
							/>
							<TextField
								label={`走者${index + 1} ニコ生`}
								defaultValue={runner.nico}
								onChange={(e) => {
									updateRunnerInfo(index, "nico", e.currentTarget.value);
								}}
							/>
							<TextField
								label={`走者${index + 1} Twitter`}
								defaultValue={runner.twitter}
								onChange={(e) => {
									updateRunnerInfo(index, "twitter", e.currentTarget.value);
								}}
							/>
							<div className='MuiFormControl-root'>
								<div className='MuiFormLabel-root'>
									<TypoGraphy variant={"caption"}>
										走者{index + 1}カメラ
									</TypoGraphy>
								</div>
								<CameraControl>
									<VideocamOffIcon />
									<Switch
										defaultValue={!!runner.camera}
										onChange={() => {
											// TODO: should prevent stale state reference
											updateRunnerInfo(index, "camera", !runner.camera);
										}}
									/>
									<VideocamIcon color={"secondary"} />
								</CameraControl>
							</div>
						</RunnerRow>
					);
				})}

				{/* 解説 */}
				{new Array(2).fill(null).map((_, index) => {
					const commentator: Participant = {
						name: "",
						...(commentators[index] as Partial<Participant>),
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
									updateCommentatorInfo(index, "twitch", e.currentTarget.value);
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
				<div>
					<Button onClick={updateClicked} color={"primary"}>
						更新
					</Button>
					<Button onClick={finish}>キャンセル</Button>
				</div>
			</Container>
		</Modal>
	);
};
