import 'source-map-support/register';
import {checklist} from './checklist';
import {schedule} from './schedule';
import {timekeeping} from './timekeeping';
import {twitchTitleUpdater} from './twitch-title-updater';
import {NodeCG} from '../../types/nodecg';
import {twitter} from './twitter';

module.exports = (nodecg: NodeCG) => {
	checklist(nodecg);
	schedule(nodecg);
	timekeeping(nodecg);
	twitchTitleUpdater(nodecg);
	twitter(nodecg);
};
