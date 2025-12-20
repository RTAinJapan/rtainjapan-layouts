import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {VerticalRaceTemplate} from "./templates/race-vertical";

export default () => {
	return (
		<VerticalRaceTemplate>
			<VideoFrame xInset={591} yInset={19} wInset={579} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "457px",
					left: "587px",
					width: "587px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={19} wInset={579} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "457px",
					left: "1189px",
					width: "587px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={591} yInset={527} wInset={579} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={2}
				style={{
					position: "absolute",
					top: "965px",
					left: "587px",
					width: "587px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={527} wInset={579} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={3}
				style={{
					position: "absolute",
					top: "965px",
					left: "1189px",
					width: "587px",
					height: "50px",
				}}
				race
			></NamePlate>
		</VerticalRaceTemplate>
	);
};
