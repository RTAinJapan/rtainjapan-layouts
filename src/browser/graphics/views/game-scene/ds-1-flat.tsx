import {VideoFrame} from "../../components/video-frame";
import {SplitSoloTemplate} from "./templates/solo-split";

export default () => {
	return (
		<SplitSoloTemplate>
			<VideoFrame xInset={630} yInset={19} wInset={659} hInset={494} />
			<VideoFrame xInset={630} yInset={517} wInset={659} hInset={494} />
		</SplitSoloTemplate>
	);
};
