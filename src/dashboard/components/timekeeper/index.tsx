// Packages
import React from 'react';
import styled from 'styled-components';
import uuidv4 from 'uuid/v4';

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
import { NoWrapButton } from '../lib/no-wrap-button';

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
	gap: 8px;
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

	public render() {
		// Disable start if checklist is not completed or timer is not stopped state
		const shouldDisableStart =
			this.state.checklistComplete !== true ||
			this.state.timer.timerState !== TimerState.Stopped;

		// Disable pause if timer is not running
		const shouldDisablePause =
			this.state.timer.timerState !== TimerState.Running;

		return (
			<Container>
				<Timer>{this.state.timer.formatted}</Timer>
				<CtrlsContainer>
					<NoWrapButton
						variant="raised"
						fullWidth
						disabled={shouldDisableStart}
						onClick={startTimer}
					>
						<PlayArrow />開始
					</NoWrapButton>
					<NoWrapButton
						variant="raised"
						fullWidth
						disabled={shouldDisablePause}
						onClick={stopTimer}
					>
						<Pause />停止
					</NoWrapButton>
					<NoWrapButton
						variant="raised"
						fullWidth
						onClick={resetTimer}
					>
						<Refresh />リセット
					</NoWrapButton>
					<NoWrapButton
						variant="raised"
						fullWidth
						onClick={this.openEdit}
					>
						<ModeEdit />編集
					</NoWrapButton>
				</CtrlsContainer>
				<RunnersContainer>
					{this.state.runners.map((runner, index) => (
						<Runner
							key={runner.id}
							checklistCompleted={this.state.checklistComplete}
							index={index}
							runner={runner.name}
							timer={this.state.timer}
						>
							{runner}
						</Runner>
					))}
				</RunnersContainer>
				<EditTimeModal
					open={this.state.isModalOpened}
					defaultValue={this.state.timer.formatted}
					onFinish={this.closeModal}
				/>
			</Container>
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
		const runners: State['runners'] = new Array(4).fill(undefined);
		const newRunners = newVal.runners;
		for (let i = 0; i < 4; i++) {
			const name = newRunners && newRunners[i] && newRunners[i].name;
			runners[i] = {name, id: uuidv4()};
		}
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
