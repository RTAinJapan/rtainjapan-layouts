import {CurrentRun} from '../../../nodecg/replicants';
import commentatorIcon from '../images/icon/commentator.png';
import {Nameplate} from './lib/nameplate';

export class RtaijCommentator extends Nameplate {
	public labelIcon = commentatorIcon;

	public label = 'Commentator';

	protected calcNewRunner = (newVal: CurrentRun) => {
		const commentators = newVal.commentators.filter(Boolean);

		// 0 commentator
		if (commentators.length === 0) {
			return {
				pk: 0,
				name: '',
			};
		}

		// 1 commentator
		if (commentators.length === 1) {
			return commentators[0];
		}

		// 2 or more commentators: show all names and nothing else
		return {
			name: commentators
				.map((c) => c.name)
				.filter(Boolean)
				.join(', '),
		};
	};
}
