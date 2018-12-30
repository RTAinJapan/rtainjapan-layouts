import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import TypoGraphy from '@material-ui/core/Typography';
import max from 'lodash/max';
import React from 'react';
import styled from 'styled-components';
import {CurrentRun, Runner} from '../../../replicants';

const Container = styled.div`
	position: absolute;

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	background-color: white;
	box-sizing: border-box;
	padding: 16px;

	display: grid;
	grid-auto-flow: row;
	grid-gap: 8px;
`;

interface Props {
	edit: 'current' | 'next' | undefined;
	defaultValue: CurrentRun;
	onFinish(): void;
}

export class EditRun extends React.Component<Props, CurrentRun> {
	public render() {
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
					<TypoGraphy variant='headline'>
						{this.props.edit === 'current' ? '現在の' : '次の'}
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
					<TextField
						defaultValue={this.props.defaultValue.duration}
						label='予定タイム'
						onChange={(e) => {
							this.setState({duration: e.currentTarget.value});
						}}
					/>
					{Array.from({length: 4}, (_, index) => {
						const runner: Runner = runners[index] || {};
						return (
							<div key={index}>
								<TextField
									label={`走者${index} 名前`}
									defaultValue={runner.name}
									onChange={(e) => {
										this.updateRunnerInfo(
											index,
											'name',
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`走者${index} Twitch`}
									defaultValue={runner.twitch}
									onChange={(e) => {
										this.updateRunnerInfo(
											index,
											'twitch',
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`走者${index} ニコ生`}
									defaultValue={runner.nico}
									onChange={(e) => {
										this.updateRunnerInfo(
											index,
											'nico',
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`走者${index} Twitter`}
									defaultValue={runner.twitter}
									onChange={(e) => {
										this.updateRunnerInfo(
											index,
											'twitter',
											e.currentTarget.value,
										);
									}}
								/>
							</div>
						);
					})}
					{new Array(4).fill(null).map((_, index) => {
						const commentator: Runner = {
							name: '',
							...commentators[index],
						};
						return (
							<div key={index}>
								<TextField
									label={`解説${index} 名前`}
									defaultValue={commentator.name}
									onChange={(e) => {
										this.updateCommentatorInfo(
											index,
											'name',
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`解説${index} Twitch`}
									defaultValue={commentator.twitch}
									onChange={(e) => {
										this.updateCommentatorInfo(
											index,
											'twitch',
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`解説${index} ニコ生`}
									defaultValue={commentator.nico}
									onChange={(e) => {
										this.updateCommentatorInfo(
											index,
											'nico',
											e.currentTarget.value,
										);
									}}
								/>
								<TextField
									label={`解説${index} Twitter`}
									defaultValue={commentator.twitter}
									onChange={(e) => {
										this.updateCommentatorInfo(
											index,
											'twitter',
											e.currentTarget.value,
										);
									}}
								/>
							</div>
						);
					})}
					<div>
						<Button onClick={this.updateClicked}>更新</Button>
						<Button onClick={this.finish}>キャンセル</Button>
					</div>
				</Container>
			</Modal>
		);
	}

	private readonly onRendered = () => {
		this.setState(this.props.defaultValue);
	};

	private readonly updateRunnerInfo = <T extends keyof Runner>(
		updatingIndex: number,
		key: T,
		value: Runner[T],
	) => {
		this.setState((state) => {
			if (!state.runners) {
				return null;
			}
			const oldRunner = state.runners[updatingIndex];
			const newRunner = {...oldRunner, [key]: value};
			const newRunners: Runner[] = [];
			const iterateLength =
				(max([updatingIndex, state.runners.length - 1]) || 0) + 1;
			for (let i = 0; i < iterateLength; i++) {
				if (i === updatingIndex) {
					newRunners.push(newRunner);
				} else {
					newRunners.push(state.runners[i]);
				}
			}
			return {runners: newRunners};
		});
	};

	private readonly updateCommentatorInfo = <T extends keyof Runner>(
		updatingIndex: number,
		key: T,
		value: Runner[T],
	) => {
		this.setState((state) => {
			if (!state.commentators) {
				return null;
			}
			const oldOne = state.commentators[updatingIndex] || {};
			const newOne = {...oldOne, [key]: value};
			const newOnes: Runner[] = [];
			const iterateLength =
				(max([updatingIndex, state.commentators.length - 1]) || 0) + 1;
			for (let i = 0; i < iterateLength; i++) {
				if (i === updatingIndex) {
					newOnes.push(newOne);
				} else {
					newOnes.push(state.commentators[i]);
				}
			}
			return {commentators: newOnes};
		});
	};

	private readonly updateClicked = async () => {
		await nodecg.sendMessage('modifyRun', this.state);
		this.finish();
	};

	private readonly finish = () => {
		this.props.onFinish();
	};
}
