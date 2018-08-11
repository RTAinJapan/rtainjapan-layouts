import {BaseInfo} from './lib/base-info';
import {TimeObject} from '../../lib/time-object';
import {stopwatchRep, currentRunRep} from '../../lib/replicants';
import {CurrentRun} from '../../../types/schemas/currentRun';

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
		this.setState({
			primaryInfo: newVal.formatted,
		});
	};

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		this.setState({
			secondaryInfo: `予定タイム ${newVal.duration || '???'}`,
		});
	};
}
