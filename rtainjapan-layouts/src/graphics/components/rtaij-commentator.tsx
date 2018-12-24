import {CurrentRun} from '../../replicants';
import commentatorIcon from '../images/icon/commentator.png';
import {Nameplate} from './lib/nameplate';

export class RtaijCommentator extends Nameplate {
	public labelIcon = commentatorIcon;

	public label = 'Commentator';

	protected calcNewRunner = (newVal: CurrentRun) => {
		const commentators = newVal.commentators.filter(Boolean);

		// 1 commentator
		if (commentators.length === 1) {
			return commentators[0];
		}

		// 2 or more commentators: show all names and nothing else
		return {
			pk: commentators[0].pk,
			name: commentators
				.map((c) => c.name)
				.filter(Boolean)
				.join(', '),
		};
	};
}
