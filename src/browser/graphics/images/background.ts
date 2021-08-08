import backgroundBlue from "./background-blue.png";
import backgroundBrown from "./background-brown.png";

export const background =
	nodecg.bundleConfig.colorTheme === "brown" ? backgroundBrown : backgroundBlue;
