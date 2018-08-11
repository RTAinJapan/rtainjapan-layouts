// Packages
import React from 'react';
import times from 'lodash/times';
import styled from 'styled-components';
import uuidv4 from 'uuid/v4';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import grey from '@material-ui/core/colors/grey';

// MUI Icons
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Refresh from '@material-ui/icons/Refresh';
import ModeEdit from '@material-ui/icons/ModeEdit';

// Ours
import {TimeObject, TimerState} from '../../../lib/time-object';
import {
	stopwatchRep,
	currentRunRep,
	checklistCompleteRep,
} from '../../../lib/replicants';
import {Runner} from './runner';
import {BorderedBox} from '../lib/bordered-box';
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {ChecklistCompleted} from '../../../../types/schemas/checklistCompleted';
import nodecg from '../../../lib/nodecg';
import {EditTimeModal} from './edit';
import {ColoredButton} from '../lib/colored-button';

const Container = BorderedBox.extend`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: 105px 1fr;
	grid-template-areas: 'timer ctrls' 'runners runners';
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
	nodecg.sendMessage('startTimer');
};

const stopTimer = () => {
	nodecg.sendMessage('stopTimer');
};

const resetTimer = () => {
	nodecg.sendMessage('resetTimer');
};

interface State {
	timer: TimeObject;
	runners: Array<{name: string | undefined; id: string}>;
	checklistComplete: boolean;
	isModalOpened: boolean;
}

export class Timekeeper extends React.Component<{}, State> {
	public state: State = {
		timer: new TimeObject(0),
		runners: [],
		checklistComplete: false,
		isModalOpened: false,
	};

	public render() {
		const {state} = this;

		// Disable start if checklist is not completed or timer is not stopped state
		const shouldDisableStart =
			state.checklistComplete !== true ||
			state.timer.timerState !== TimerState.Stopped;

		// Disable pause if timer is not running
		const shouldDisablePause =
			state.timer.timerState !== TimerState.Running;

		return (
			<Container>
				<Timer>{state.timer.formatted}</Timer>
				<CtrlsContainer>
					<ColoredButton
						color={green}
						ButtonProps={{
							disabled: shouldDisableStart,
							onClick: startTimer,
							fullWidth: true,
						}}
					>
						<PlayArrow />開始
					</ColoredButton>
					<ColoredButton
						color={orange}
						ButtonProps={{
							disabled: shouldDisablePause,
							onClick: stopTimer,
							fullWidth: true,
						}}
					>
						<Pause />停止
					</ColoredButton>
					<ColoredButton
						color={pink}
						ButtonProps={{
							onClick: resetTimer,
							fullWidth: true,
						}}
					>
						<Refresh />リセット
					</ColoredButton>
					<ColoredButton
						color={grey}
						ButtonProps={{
							onClick: this.openEdit,
							fullWidth: true,
						}}
					>
						<ModeEdit />編集
					</ColoredButton>
				</CtrlsContainer>

				<RunnersContainer>
					{state.runners.map((runner, index) => (
						<Runner
							key={runner.id}
							checklistCompleted={state.checklistComplete}
							index={index}
							runner={runner.name}
							timer={state.timer}
						>
							{runner}
						</Runner>
					))}
				</RunnersContainer>

				<EditTimeModal
					open={state.isModalOpened}
					defaultValue={state.timer.formatted}
					onFinish={this.closeModal}
				/>
			</Container>
		);
	}

	public componentDidMount() {
		stopwatchRep.on('change', this.stopwatchRepChangeHandler);
		currentRunRep.on('change', this.currentRunChangeHandler);
		checklistCompleteRep.on('change', this.checklistCompleteChangeHandler);
	}

	public componentWillUnmount() {
		stopwatchRep.removeListener('change', this.stopwatchRepChangeHandler);
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
		checklistCompleteRep.removeListener(
			'change',
			this.checklistCompleteChangeHandler
		);
	}

	private readonly closeModal = (value?: string) => {
		if (value) {
			nodecg.sendMessage('editTime', {index: 'master', newTime: value});
		}
		this.setState({isModalOpened: false});
	};

	private readonly openEdit = () => {
		this.setState({isModalOpened: true});
	};

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		const runners: State['runners'] = [];
		const newRunners = newVal.runners;
		times(4, i => {
			const name = newRunners && newRunners[i] && newRunners[i].name;
			runners[i] = {name, id: uuidv4()};
		});
		this.setState({
			runners,
		});
	};

	private readonly checklistCompleteChangeHandler = (
		newVal: ChecklistCompleted
	) => {
		if (newVal === this.state.checklistComplete) {
			return;
		}
		this.setState({
			checklistComplete: newVal,
		});
	};

	private readonly stopwatchRepChangeHandler = (newVal: TimeObject) => {
		this.setState({
			timer: newVal,
		});
	};
}
