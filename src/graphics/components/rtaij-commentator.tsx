import commentatorIcon from '../images/icon/commentator.png';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {Nameplate} from './lib/nameplate';

export class RtaijCommentator extends Nameplate {
	public labelIcon = commentatorIcon;

	public label = 'Commentator';

	protected calcNewRunner = (newVal: CurrentRun) => {
		if (!newVal.commentators) {
			return;
		}
		const commentators = newVal.commentators.filter(c => Boolean(c));

		// 1 commentator
		if (commentators.length === 1) {
			return commentators[0];
		}

		// 2 or more commentators: show all names and nothing else
		return {
			name: commentators
				.map(c => c.name)
				.filter(Boolean)
				.join(', '),
		};
	};
}
