import {VideoFrame} from "../../components/video-frame";
import {SplitSoloTemplate} from "./templates/solo-split";

export default () => {
	return (
		<SplitSoloTemplate>
			<VideoFrame xInset={547} yInset={18} wInset={825} hInset={495} />
			<VideoFrame xInset={629} yInset={517} wInset={660} hInset={495} />
		</SplitSoloTemplate>
	);
};
