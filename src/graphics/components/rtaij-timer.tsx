import {BaseInfo} from './lib/base-info';
import {TimeObject, TimerState} from '../../lib/time-object';
import {stopwatchRep, currentRunRep} from '../../lib/replicants';
import {CurrentRun} from '../../../types/schemas/currentRun';

const timerStateColorMap = {
	[TimerState.Stopped]: '#9a9fa1',
	[TimerState.Running]: '#ffffff',
	[TimerState.Finished]: '#ffff52',
};

const calcColorFromTimeState = (timer: TimeObject) => {
	if (timer.timerState === TimerState.Stopped) {
		return timerStateColorMap[TimerState.Stopped];
	}
	if (timer.timerState === TimerState.Running) {
		return timerStateColorMap[TimerState.Running];
	}
	const allForfeit = timer.results.every(result =>
		Boolean(result && result.forfeit)
	);
	if (allForfeit) {
		return timerStateColorMap[TimerState.Stopped];
	}
	return timerStateColorMap[TimerState.Finished];
};

export class RtaijTimer extends BaseInfo {
	public componentDidMount() {
		if (super.componentDidMount) {
			super.componentDidMount();
		}
		stopwatchRep.on('change', this.timerChangeHandler);
		currentRunRep.on('change', this.currentRunChangeHandler);
	}

	public componentWillUnmount() {
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}
		stopwatchRep.removeListener('change', this.timerChangeHandler);
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
	}

	private readonly timerChangeHandler = (newVal: TimeObject) => {
		const color = calcColorFromTimeState(newVal);
		this.setState({
			primaryInfo: newVal.formatted,
			primaryInfoColor: color,
		});
	};

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		this.setState({
			secondaryInfo: `予定タイム ${newVal.duration || '???'}`,
		});
	};
}
