import {BaseInfo} from './lib/base-info';

export class RtaijTimer extends BaseInfo {
	componentDidMount() {
		if (super.componentDidMount) {
			super.componentDidMount();
		}
		this.setState({
			primaryInfo: '1:23:45',
			secondaryInfo: '予定タイム 6:17:28'
		})
	}
}
