import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {VerticalRaceTemplate} from "./templates/race-vertical";

export default () => {
	return (
		<VerticalRaceTemplate>
			<VideoFrame xInset={462} yInset={62} wInset={708} hInset={424} />
			<VideoFrame xInset={532} yInset={490} wInset={566} hInset={424} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "918px",
					left: "528px",
					width: "574px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={62} wInset={708} hInset={424} />
			<VideoFrame xInset={1263} yInset={490} wInset={566} hInset={424} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "918px",
					left: "1259px",
					width: "574px",
					height: "50px",
				}}
				race
			></NamePlate>
		</VerticalRaceTemplate>
	);
};
