import React from 'react';
import commentatorIcon from '../images/icon/commentator.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {BaseNameplate} from './lib/base-nameplate';

export class RtaijCommentator extends BaseNameplate {
	applyCurrentRunChangeToState = (newVal: CurrentRun) => {
		this.setState({
			runners: newVal.commentators,
		});
	};
	iconPath = commentatorIcon;
	label = 'Commentator';

	render() {
		const Container = this.Container;
		return <Container />;
	}
}
