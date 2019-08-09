import {CurrentRun} from '../../../nodecg/replicants';
import {BaseInfo} from './lib/base-info';

const currentRunRep = nodecg.Replicant('current-run');

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
		if (!newVal) {
			return;
		}
		this.setState({
			primaryInfo: newVal.title || '',
			secondaryInfo: miscText(newVal),
		});
	};
}

function miscText(newVal: CurrentRun) {
	if (!newVal) {
		return '';
	}
	const {platform} = newVal;
	return newVal.category + (platform ? ` - ${platform}` : '');
}
