import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {VerticalRaceTemplate} from "./templates/race-vertical";

export default () => {
	return (
		<VerticalRaceTemplate>
			<VideoFrame xInset={687} yInset={19} wInset={483} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "457px",
					left: "683px",
					width: "491px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={19} wInset={483} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "457px",
					left: "1189px",
					width: "491px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={687} yInset={527} wInset={483} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={2}
				style={{
					position: "absolute",
					top: "965px",
					left: "683px",
					width: "491px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VideoFrame xInset={1193} yInset={527} wInset={483} hInset={434} />
			<NamePlate
				variant='single'
				kind='runners'
				index={3}
				style={{
					position: "absolute",
					top: "965px",
					left: "1189px",
					width: "491px",
					height: "50px",
				}}
				race
			></NamePlate>
		</VerticalRaceTemplate>
	);
};
