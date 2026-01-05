import {VideoFrame} from "../../components/video-frame";
import {LShapedSoloTemplate} from "./templates/solo-l-shape";

export default () => {
	return (
		<LShapedSoloTemplate>
			<VideoFrame xInset={462} yInset={140} wInset={1025} hInset={615} />
			<VideoFrame xInset={1491} yInset={448} wInset={410} hInset={307} />
		</LShapedSoloTemplate>
	);
};
