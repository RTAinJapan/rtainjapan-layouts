import React from 'react';
import commentatorIcon from '../images/icon/commentator.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {Nameplate} from './lib/nameplate';

export class RtaijCommentator extends Nameplate {
	public labelIcon = commentatorIcon;

	public label = 'Commentator';

	public applyCurrentRunChangeToState = (newVal: CurrentRun) => {
		this.setState({
			runners: newVal.commentators,
		});
	};

	public render() {
		const {Container} = this;
		return <Container />;
	}
}
