import {checklist} from "./checklist";
import schedule from "./schedule";
import {timekeeping} from "./timekeeping";
import {NodeCG} from "./nodecg";
import {twitch} from "./twitch";
import {setupObs} from "./obs";
import {tracker} from "./tracker";
import {music} from "./music";
import {wing} from "./wing";

export default (nodecg: NodeCG) => {
	checklist(nodecg);
	schedule(nodecg);
	music(nodecg);
	timekeeping(nodecg);
	twitch(nodecg);
	setupObs(nodecg);
	tracker(nodecg);
	wing(nodecg);

	const cameraStateRep = nodecg.Replicant("camera-state");
	if (cameraStateRep.value !== "hidden") {
		cameraStateRep.value = "hidden";
	}
	nodecg.listenFor("toggleCameraName", () => {
		if (cameraStateRep.value === "hidden") {
			cameraStateRep.value = "small";
		} else {
			cameraStateRep.value = "hidden";
		}
	});
};
