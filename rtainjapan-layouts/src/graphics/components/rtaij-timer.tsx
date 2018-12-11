import {CurrentRun, Timer} from '../../lib/replicant';
import {TimerState} from '../../lib/replicant/lib';
import {BaseInfo} from './lib/base-info';

const currentRunRep = nodecg.Replicant<CurrentRun>('currentRun');
const timerRep = nodecg.Replicant<Timer>('timer');

const timerStateColorMap = {
	[TimerState.Stopped]: '#9a9fa1',
	[TimerState.Running]: '#ffffff',
	[TimerState.Finished]: '#ffff52',
};

const calcColorFromTimeState = (timer: Timer) => {
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
		timerRep.on('change', this.timerChangeHandler);
		currentRunRep.on('change', this.currentRunChangeHandler);
	}

	public componentWillUnmount() {
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}
		timerRep.removeListener('change', this.timerChangeHandler);
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
	}

	private readonly timerChangeHandler = (newVal: Timer) => {
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
