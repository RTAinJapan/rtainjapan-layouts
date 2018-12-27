import 'source-map-support/register';

import {NodeCG} from 'nodecg/types/server';
import {checklist} from './checklist';
import schedule from './schedule';
import {spotify} from './spotify';
import {timekeeping} from './timekeeping';
import {twitter} from './twitter';

export = (nodecg: NodeCG) => {
	checklist(nodecg);
	schedule(nodecg);
	timekeeping(nodecg);
	twitter(nodecg);
	spotify(nodecg);
};
