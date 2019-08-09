import runnerIcon from '../images/icon/runner.png';
import {Nameplate} from './lib/nameplate';
import {CurrentRun} from '../../../nodecg/replicants';

export class RtaijRunner extends Nameplate {
	public labelIcon = runnerIcon;

	public label = 'Runner';

	public calcNewRunner = (newVal: CurrentRun) =>
		newVal && newVal.runners[this.props.index];
}
