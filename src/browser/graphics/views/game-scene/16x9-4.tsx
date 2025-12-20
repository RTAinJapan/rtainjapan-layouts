import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {VerticalRaceTemplate} from "./templates/race-vertical";

export default () => {
	return (
		<VerticalRaceTemplate>
			<VideoFrame xInset={462} yInset={56} wInset={708} hInset={398} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "458px",
					left: "458px",
					width: "716px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={56} wInset={708} hInset={398} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "458px",
					left: "1189px",
					width: "716px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={462} yInset={527} wInset={708} hInset={398} />
			<NamePlate
				variant='single'
				kind='runners'
				index={2}
				style={{
					position: "absolute",
					top: "929px",
					left: "458px",
					width: "716px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={527} wInset={708} hInset={398} />
			<NamePlate
				variant='single'
				kind='runners'
				index={3}
				style={{
					position: "absolute",
					top: "929px",
					left: "1189px",
					width: "716px",
					height: "50px",
				}}
				race
			></NamePlate>
		</VerticalRaceTemplate>
	);
};
