import runnerIcon from '../images/icon/runner.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {Nameplate} from './lib/nameplate';

export class RtaijRunner extends Nameplate {
	public labelIcon = runnerIcon;

	public label = 'Runner';

	public calcNewRunner = (newVal: CurrentRun) =>
		newVal.runners && newVal.runners[this.props.index];
}
