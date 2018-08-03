import React from 'react';
import {BaseInfo} from './lib/base-info';

interface Props {
}

export class RtaijTimer extends React.Component<Props> {
	render() {
		return (
			<BaseInfo
				primaryInfo="1:23:34"
				secondaryInfo="予定タイム 5:45:55"
				initialPrimarySize={60}
				secondarySize={30}
			/>
		);
	}
}
