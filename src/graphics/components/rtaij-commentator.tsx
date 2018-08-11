import React from 'react';
import commentatorIcon from '../images/icon/commentator.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {Nameplate} from './lib/nameplate';

export class RtaijCommentator extends Nameplate {
	public labelIcon = commentatorIcon;

	public label = 'Commentator';

	public applyCurrentRunChangeToState = (newVal: CurrentRun) => {
		const commentators = (newVal.commentators || []).filter(c =>
			Boolean(c.name)
		);
		if (!commentators) {
			this.setState({
				runners: undefined,
			});
			return;
		}
		if (commentators.length === 1) {
			this.setState({
				runners: commentators,
			});
			return;
		}

		// 2 or more commentators: show all names and nothing else
		this.setState({
			runners: [
				{
					name: commentators
						.map(c => c.name)
						.filter(Boolean)
						.join(', '),
				},
			],
		});
	};

	public render() {
		const {Container} = this;
		return <Container />;
	}
}
