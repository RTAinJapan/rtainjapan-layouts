import {VideoFrame} from "../../components/video-frame";
import {LShapedSoloTemplate} from "./templates/solo-l-shape";

export default () => {
	return (
		<LShapedSoloTemplate>
			<VideoFrame xInset={462} yInset={116} wInset={884} hInset={663} />
			<VideoFrame xInset={1350} yInset={116} wInset={550} hInset={330} />
		</LShapedSoloTemplate>
	);
};
