import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import Edit from '@material-ui/icons/Edit';
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Refresh from '@material-ui/icons/Refresh';
import React from 'react';
import styled from 'styled-components';
import uuidv4 from 'uuid/v4';
import {CurrentRun, Timer, Checklist} from '../../../../nodecg/replicants';
import {newTimer} from '../../../../nodecg/timer';
import {BorderedBox} from '../lib/bordered-box';
import {ColoredButton} from '../lib/colored-button';
import {EditTimeModal} from './edit';
import {Runner} from './runner';

const checklistRep = nodecg.Replicant('checklist');
const currentRunRep = nodecg.Replicant('current-run');
const timerRep = nodecg.Replicant('timer');

const Container = styled(BorderedBox)`
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
	nodecg.sendMessage('startTimer', undefined);
};

const stopTimer = () => {
	nodecg.sendMessage('stopTimer');
};

const resetTimer = () => {
	nodecg.sendMessage('resetTimer');
};

interface State {
	timer: Timer;
	runners: Array<{name: string | undefined; id: string}>;
	checklistComplete: boolean;
	isModalOpened: boolean;
}

export class Timekeeper extends React.Component<{}, State> {
	public state: State = {
		timer: newTimer(0),
		runners: [],
		checklistComplete: false,
		isModalOpened: false,
	};

	public render() {
		const {state} = this;

		// Disable start if checklist is not completed or timer is not stopped state
		const shouldDisableStart =
			!state.checklistComplete || state.timer.timerState !== 'Stopped';

		// Disable pause if timer is not running
		const shouldDisablePause = state.timer.timerState !== 'Running';

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
						<PlayArrow />
						開始
					</ColoredButton>
					<ColoredButton
						color={orange}
						ButtonProps={{
							disabled: shouldDisablePause,
							onClick: stopTimer,
							fullWidth: true,
						}}
					>
						<Pause />
						停止
					</ColoredButton>
					<ColoredButton
						color={pink}
						ButtonProps={{
							onClick: resetTimer,
							fullWidth: true,
						}}
					>
						<Refresh />
						リセット
					</ColoredButton>
					<ColoredButton
						color={grey}
						ButtonProps={{
							onClick: this.openEdit,
							fullWidth: true,
						}}
					>
						<Edit />
						編集
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
		timerRep.on('change', this.stopwatchRepChangeHandler);
		currentRunRep.on('change', this.currentRunChangeHandler);
		checklistRep.on('change', this.checklistChangeHandler);
	}

	public componentWillUnmount() {
		timerRep.removeListener('change', this.stopwatchRepChangeHandler);
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
		checklistRep.removeListener('change', this.checklistChangeHandler);
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
		if (!newVal) {
			return;
		}
		const newRunners = newVal.runners;
		this.setState({
			runners: Array.from({length: 4}, (_, index) => {
				const name =
					newRunners && newRunners[index] && newRunners[index].name;
				return {name, id: uuidv4()};
			}),
		});
	};

	private readonly checklistChangeHandler = (newVal: Checklist) => {
		this.setState({
			checklistComplete: newVal.every((item) => item.complete),
		});
	};

	private readonly stopwatchRepChangeHandler = (newVal: Timer) => {
		this.setState({
			timer: newVal,
		});
	};
}
