import {VideoFrame} from "../../components/video-frame";
import {LShapedSoloTemplate} from "./templates/solo-l-shape";

export default () => {
	return (
		<LShapedSoloTemplate>
			<VideoFrame xInset={462} yInset={94} wInset={944} hInset={708} />
			<VideoFrame xInset={1429} yInset={488} wInset={472} hInset={314} />
		</LShapedSoloTemplate>
	);
};
