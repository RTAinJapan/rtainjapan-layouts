import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {HorizontalRaceTemplate} from "./templates/race-horizontal";

export default () => {
	return (
		<HorizontalRaceTemplate>
			<VideoFrame xInset={19} yInset={76} wInset={612} hInset={550} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "630px",
					left: "15px",
					width: "620px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={654} yInset={76} wInset={612} hInset={550} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "630px",
					left: "650px",
					width: "620px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1289} yInset={76} wInset={612} hInset={550} />
			<NamePlate
				variant='single'
				kind='runners'
				index={2}
				style={{
					position: "absolute",
					top: "630px",
					left: "1285px",
					width: "620px",
					height: "50px",
				}}
				race
			></NamePlate>
		</HorizontalRaceTemplate>
	);
};
