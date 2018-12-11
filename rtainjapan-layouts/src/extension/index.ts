import 'source-map-support/register';
import {NodeCG} from '../../types/nodecg';
import {checklist} from './checklist';
import {schedule} from './schedule';
import {timekeeping} from './timekeeping';
import {twitter} from './twitter';

module.exports = (nodecg: NodeCG) => {
	checklist(nodecg);
	schedule(nodecg);
	timekeeping(nodecg);
	twitter(nodecg);
};
