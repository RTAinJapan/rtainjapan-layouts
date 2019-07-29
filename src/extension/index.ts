import 'source-map-support/register';
import {checklist} from './checklist';
import schedule from './schedule';
import {spotify} from './spotify';
import {timekeeping} from './timekeeping';
import {twitter} from './twitter';
import {NodeCG} from './nodecg';

export = (nodecg: NodeCG) => {
	checklist(nodecg);
	schedule(nodecg);
	timekeeping(nodecg);
	twitter(nodecg);
	spotify(nodecg);
};
