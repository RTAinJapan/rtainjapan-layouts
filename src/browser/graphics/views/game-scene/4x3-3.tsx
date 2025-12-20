import {NamePlate} from "../../components/nameplate";
import {CSSProperties} from "react";
import {HorizontalRaceTemplate} from "./templates/race-horizontal";
import {VideoFrame} from "../../components/video-frame";

const namePlateStyle: CSSProperties = {
	position: "absolute",
	width: "620px",
	height: "50px",
};

export default () => {
	return (
		<HorizontalRaceTemplate>
			<VideoFrame xInset={19} yInset={122} wInset={612} hInset={459} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{top: "585px", left: "14px", ...namePlateStyle}}
				race
			></NamePlate>
			<VideoFrame xInset={654} yInset={122} wInset={612} hInset={459} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{top: "585px", left: "649px", ...namePlateStyle}}
				race
			></NamePlate>
			<VideoFrame xInset={1289} yInset={122} wInset={612} hInset={459} />
			<NamePlate
				variant='single'
				kind='runners'
				index={2}
				style={{top: "585px", left: "1285px", ...namePlateStyle}}
				race
			></NamePlate>
		</HorizontalRaceTemplate>
	);
};
