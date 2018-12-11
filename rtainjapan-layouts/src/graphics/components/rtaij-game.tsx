import {CurrentRun} from '../../lib/replicant';
import {BaseInfo} from './lib/base-info';

const currentRunRep = nodecg.Replicant<CurrentRun>('currentRun');

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
	const {platform} = newVal;
	return newVal.category + (platform ? ` - ${platform}` : '');
}
