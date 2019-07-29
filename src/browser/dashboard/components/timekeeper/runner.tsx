import blueGrey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import Cancel from '@material-ui/icons/Cancel';
import Edit from '@material-ui/icons/Edit';
import Flag from '@material-ui/icons/Flag';
import Undo from '@material-ui/icons/Undo';
import React from 'react';
import styled, {css} from 'styled-components';
import {Timer} from '../../../../nodecg/replicants';
import {ColoredButton} from '../lib/colored-button';
import {EditTimeModal} from './edit';

const Container = styled.div`
	padding: 0 16px;
	display: grid;
	align-items: center;
	${(props: {index: number}) =>
		props.index % 2 === 0 &&
		css`
			background-color: #dedede;
		`};
`;

const RunnerContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-areas: 'runner button';
`;

const RunnerName = styled.div`
	font-size: 24px;
`;

const RunnerStatus = styled.div`
	font-size: 24px;
	color: #adadad;
	${(props: {finished: boolean}) =>
		props.finished &&
		css`
			color: #43ac6a;
		`};
`;

const ButtonContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 80px);
	grid-gap: 8px;
	justify-items: stretch;
	align-items: center;
`;

const EmptySlot = styled.div`
	font-size: 24px;
	color: #adadad;
	text-align: center;
`;

interface State {
	isModalOpened: boolean;
}

interface Props {
	runner: string | undefined;
	checklistCompleted: boolean;
	timer: Timer;
	index: number;
}

export class Runner extends React.Component<Props, State> {
	public state: State = {isModalOpened: false};

	public render() {
		return (
			<Container index={this.props.index}>
				{this.renderContent()}
			</Container>
		);
	}

	private renderContent() {
		const {props} = this;
		if (!props.runner) {
			return <EmptySlot>― EMPTY SLOT ―</EmptySlot>;
		}

		const result = props.timer.results[props.index];
		const shouldShowResume = Boolean(result);
		const shouldDisableEdit = !shouldShowResume;
		const shouldShowFinish = Boolean(!result || result.forfeit);
		const shouldShowForfeit = Boolean(!result || !result.forfeit);
		const status = result ? result.formatted : 'Running';
		const defaultEditValue = result ? result.formatted : '00:00';

		return (
			<RunnerContainer>
				<div>
					<RunnerName>{props.runner}</RunnerName>
					<RunnerStatus finished={!shouldShowFinish}>
						{status}
					</RunnerStatus>
				</div>
				<ButtonContainer>
					{shouldShowFinish && (
						<ColoredButton
							color={green}
							ButtonProps={{
								fullWidth: true,
								onClick: this.completeRunner,
							}}
						>
							<Flag />
							完走
						</ColoredButton>
					)}
					{shouldShowResume && (
						<ColoredButton
							color={green}
							ButtonProps={{
								fullWidth: true,
								onClick: this.resumeRunner,
							}}
						>
							<Undo />
							再開
						</ColoredButton>
					)}
					{shouldShowForfeit && (
						<ColoredButton
							color={blueGrey}
							ButtonProps={{
								fullWidth: true,
								onClick: this.forfeitRunner,
							}}
						>
							<Cancel />
							リタイア
						</ColoredButton>
					)}
					<ColoredButton
						color={grey}
						ButtonProps={{
							fullWidth: true,
							onClick: this.startEdit,
							disabled: shouldDisableEdit,
						}}
					>
						<Edit />
						編集
					</ColoredButton>
				</ButtonContainer>
				<EditTimeModal
					defaultValue={defaultEditValue}
					open={this.state.isModalOpened}
					onFinish={this.onEditFinish}
				/>
			</RunnerContainer>
		);
	}

	private readonly startEdit = () => {
		this.setState({
			isModalOpened: true,
		});
	};

	private readonly onEditFinish = (value?: string) => {
		if (value) {
			nodecg.sendMessage('editTime', {
				index: this.props.index,
				newTime: value,
			});
		}
		this.setState({
			isModalOpened: false,
		});
	};

	private readonly completeRunner = () => {
		nodecg.sendMessage('completeRunner', {
			index: this.props.index,
			forfeit: false,
		});
	};

	private readonly resumeRunner = () => {
		nodecg.sendMessage('resumeRunner', this.props.index);
	};

	private readonly forfeitRunner = () => {
		nodecg.sendMessage('completeRunner', {
			index: this.props.index,
			forfeit: true,
		});
	};
}
