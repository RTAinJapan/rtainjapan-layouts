import {currentRunRep} from '../../lib/replicants';
import {BaseInfo} from './lib/base-info';
import {CurrentRun} from '../../../types/schemas/currentRun';

export class RtaijGame extends BaseInfo {
	public componentDidMount() {
		if (super.componentDidMount) {
			super.componentDidMount();
		}
		currentRunRep.on('change', this.currentRunChangeHandler);
	}

	public componentWillUnmount() {
		if (super.componentWillUnmount) {
			super.componentWillUnmount();
		}
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
	}

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		this.setState({
			primaryInfo: newVal.title || '',
			secondaryInfo: miscText(newVal),
		});
	};
}

function miscText(newVal: CurrentRun) {
	const {hardware} = newVal;
	return newVal.category + (hardware ? ` - ${hardware}` : '');
}
