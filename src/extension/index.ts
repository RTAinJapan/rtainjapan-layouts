import "source-map-support/register";
import {checklist} from "./checklist";
import schedule from "./schedule";
import {spotify} from "./spotify";
import {timekeeping} from "./timekeeping";
import {twitter} from "./twitter";
import {NodeCG} from "./nodecg";
import {twitch} from "./twitch";
import {setupObs} from "./obs";
import {tracker} from "./tracker";

export = (nodecg: NodeCG) => {
	checklist(nodecg);
	schedule(nodecg);
	spotify(nodecg);
	timekeeping(nodecg);
	twitter(nodecg);
	twitch(nodecg);
	setupObs(nodecg);
	tracker(nodecg);
};
