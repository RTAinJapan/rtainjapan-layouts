import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {HorizontalRaceTemplate} from "./templates/race-horizontal";

export default () => {
	return (
		<HorizontalRaceTemplate>
			<VideoFrame xInset={62} yInset={19} wInset={886} hInset={664} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "687px",
					left: "58px",
					width: "894px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={972} yInset={19} wInset={886} hInset={664} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "687px",
					left: "968px",
					width: "894px",
					height: "50px",
				}}
				race
			></NamePlate>
		</HorizontalRaceTemplate>
	);
};
