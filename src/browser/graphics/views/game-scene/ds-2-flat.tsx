import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {VerticalRaceTemplate} from "./templates/race-vertical";

export default () => {
	return (
		<VerticalRaceTemplate>
			<VideoFrame xInset={544} yInset={19} wInset={626} hInset={469} />
			<VideoFrame xInset={544} yInset={492} wInset={626} hInset={469} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "965px",
					left: "540px",
					width: "634px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={19} wInset={626} hInset={469} />
			<VideoFrame xInset={1193} yInset={492} wInset={626} hInset={469} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "965px",
					left: "1189px",
					width: "634px",
					height: "50px",
				}}
				race
			></NamePlate>
		</VerticalRaceTemplate>
	);
};
