import {checklist} from "./checklist";
import schedule from "./schedule";
import {timekeeping} from "./timekeeping";
import {NodeCG} from "./nodecg";
import {twitch} from "./twitch";
import {setupObs} from "./obs";
import {tracker} from "./tracker";
import {music} from "./music";
import {pokemon} from "./pokemon";

export default (nodecg: NodeCG) => {
	checklist(nodecg);
	schedule(nodecg);
	music(nodecg);
	timekeeping(nodecg);
	twitch(nodecg);
	setupObs(nodecg);
	tracker(nodecg);

	const cameraStateRep = nodecg.Replicant("camera-state");
	if (cameraStateRep.value !== "hidden") {
		cameraStateRep.value = "hidden";
	}
	nodecg.listenFor("toggleCameraName", () => {
		if (cameraStateRep.value === "hidden") {
			cameraStateRep.value = "big";
			setTimeout(() => {
				cameraStateRep.value = "small";
			}, 10 * 1000);
		} else {
			cameraStateRep.value = "hidden";
		}
	});

	pokemon(nodecg);
};
