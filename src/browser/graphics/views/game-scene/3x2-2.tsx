import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {HorizontalRaceTemplate} from "./templates/race-horizontal";

export default () => {
	return (
		<HorizontalRaceTemplate>
			<VideoFrame xInset={19} yInset={42} wInset={929} hInset={619} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "665px",
					left: "15px",
					width: "937px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={972} yInset={42} wInset={929} hInset={619} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "665px",
					left: "968px",
					width: "937px",
					height: "50px",
				}}
				race
			></NamePlate>
		</HorizontalRaceTemplate>
	);
};
