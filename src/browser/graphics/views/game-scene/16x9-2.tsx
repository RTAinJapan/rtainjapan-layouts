import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {HorizontalRaceTemplate} from "./templates/race-horizontal";

export default () => {
	return (
		<HorizontalRaceTemplate>
			<VideoFrame xInset={19} yInset={90} wInset={929} hInset={522} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "616px",
					left: "14px",
					width: "937px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={972} yInset={90} wInset={929} hInset={522} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "616px",
					left: "968px",
					width: "937px",
					height: "50px",
				}}
				race
			></NamePlate>
		</HorizontalRaceTemplate>
	);
};
