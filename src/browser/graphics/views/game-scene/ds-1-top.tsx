import {VideoFrame} from "../../components/video-frame";
import {LShapedSoloTemplate} from "./templates/solo-l-shape";

export default () => {
	return (
		<LShapedSoloTemplate>
			<VideoFrame xInset={462} yInset={89} wInset={956} hInset={717} />
			<VideoFrame xInset={1422} yInset={448} wInset={478} hInset={358} />
		</LShapedSoloTemplate>
	);
};
