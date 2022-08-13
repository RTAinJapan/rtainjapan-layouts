import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import TypoGraphy from "@material-ui/core/Typography";
import max from "lodash/max";
import React from "react";
import styled from "styled-components";
import {Participant, Run} from "../../../../nodecg/replicants";
import Switch from "@material-ui/core/Switch";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";

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

interface Props {
	edit: "current" | "next" | undefined;
	defaultValue?: Run;
	onFinish(): void;
}

type Props2 = {defaultValue: boolean; onChange: Function};
const Switch2: React.FC<Props2> = (props: Props2) => {
	const [enable, setEnable] = React.useState(props.defaultValue);
	return (
		<Switch
			color='primary'
			checked={enable}
			onChange={() => {
				setEnable(!enable);
				props.onChange();
			}}
		/>
	);
};

export class EditRun extends React.Component<Props, Run> {
	public render() {
		if (!this.props.defaultValue) {
			return null;
		}
		const runners = this.props.defaultValue.runners || [];
		const commentators = this.props.defaultValue.commentators || [];
		return (
			<Modal
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
				open={Boolean(this.props.edit)}
				onRendered={this.onRendered}
			>
				<Container>
					<TypoGraphy variant='h4'>
						{this.props.edit === "current" ? "現在の" : "次の"}
						ゲームを編集
					</TypoGraphy>
					<TextField
						defaultValue={this.props.defaultValue.title}
						label='タイトル'
						onChange={(e) => {
							this.setState({title: e.currentTarget.value});
						}}
					/>
					<TextField
						defaultValue={this.props.defaultValue.category}
						label='カテゴリ'
						onChange={(e) => {
							this.setState({category: e.currentTarget.value});
						}}
					/>
					<RunnerRow>
						<TextField
							defaultValue={this.props.defaultValue.runDuration}
							label='予定タイム'
							onChange={(e) => {
								this.setState({runDuration: e.currentTarget.value});
							}}
						/>
						<TextField
							defaultValue={this.props.defaultValue.platform}
							label='機種'
							onChange={(e) => {
								this.setState({platform: e.currentTarget.value});
							}}
						/>
						<TextField
							defaultValue={this.props.defaultValue.releaseYear}
							label='発売年'
							onChange={(e) => {
								this.setState({releaseYear: parseInt(e.currentTarget.value)});
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
										this.updateRunnerInfo(index, "name", e.currentTarget.value);
									}}
								/>
								<TextField
									label={`走者${index + 1} Twitch`}
									defaultValue={runner.twitch}
									onChange={(e) => {
										this.updateRunnerInfo(
											index,
											"twitch",
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`走者${index + 1} ニコ生`}
									defaultValue={runner.nico}
									onChange={(e) => {
										this.updateRunnerInfo(index, "nico", e.currentTarget.value);
									}}
								/>
								<TextField
									label={`走者${index + 1} Twitter`}
									defaultValue={runner.twitter}
									onChange={(e) => {
										this.updateRunnerInfo(
											index,
											"twitter",
											e.currentTarget.value,
										);
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
										<Switch2
											defaultValue={!!runner.camera}
											onChange={() => {
												this.updateRunnerInfo(index, "camera", !runner.camera);
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
										this.updateCommentatorInfo(
											index,
											"name",
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`解説${index + 1} Twitch`}
									defaultValue={commentator.twitch}
									onChange={(e) => {
										this.updateCommentatorInfo(
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
										this.updateCommentatorInfo(
											index,
											"nico",
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`解説${index + 1} Twitter`}
									defaultValue={commentator.twitter}
									onChange={(e) => {
										this.updateCommentatorInfo(
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
						<Button onClick={this.updateClicked} color={"primary"}>
							更新
						</Button>
						<Button onClick={this.finish}>キャンセル</Button>
					</div>
				</Container>
			</Modal>
		);
	}

	private readonly onRendered = () => {
		if (this.props.defaultValue) {
			this.setState(this.props.defaultValue);
		}
	};

	private readonly updateRunnerInfo = <T extends keyof Participant>(
		updatingIndex: number,
		key: T,
		value: Participant[T],
	) => {
		this.setState((state) => {
			if (!state.runners) {
				return null;
			}
			// 固定値で4行表示してるので、対象のindexのoldが取得できないこともある
			const oldRunner: Partial<typeof state.runners[0]> = state.runners[
				updatingIndex
			] || {name: ""};
			const newRunner = {name: "", ...oldRunner, [key]: value};
			const newRunners: Participant[] = [];
			const iterateLength =
				(max([updatingIndex, state.runners.length - 1]) || 0) + 1;
			for (let i = 0; i < iterateLength; i++) {
				if (i === updatingIndex) {
					newRunners.push(newRunner);
				} else {
					newRunners.push(state.runners[i] || {name: ""});
				}
			}
			return {runners: newRunners};
		});
	};

	private readonly updateCommentatorInfo = <T extends keyof Participant>(
		updatingIndex: number,
		key: T,
		value: Participant[T],
	) => {
		this.setState((state) => {
			if (!state.commentators) {
				return null;
			}
			const oldOne = state.commentators[updatingIndex] ?? {name: ""};
			const newOne = {...oldOne, [key]: value};
			const newOnes: Participant[] = [];
			const iterateLength =
				(max([updatingIndex, state.commentators.length - 1]) || 0) + 1;
			for (let i = 0; i < iterateLength; i++) {
				if (i === updatingIndex) {
					newOnes.push(newOne);
				} else {
					newOnes.push(state.commentators[i] || {name: ""});
				}
			}
			return {commentators: newOnes};
		});
	};

	private readonly updateClicked = async () => {
		await nodecg.sendMessage("modifyRun", this.state);
		this.finish();
	};

	private readonly finish = () => {
		this.props.onFinish();
	};
}
