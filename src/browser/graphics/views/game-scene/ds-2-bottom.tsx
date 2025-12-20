import {NamePlate} from "../../components/nameplate";
import {VideoFrame} from "../../components/video-frame";
import {VerticalRaceTemplate} from "./templates/race-vertical";

export default () => {
	return (
		<VerticalRaceTemplate>
			<VideoFrame xInset={816} yInset={115} wInset={354} hInset={265} />
			<VideoFrame xInset={462} yInset={384} wInset={708} hInset={531} />
			<NamePlate
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "180px",
					left: "458px",
					width: "344px",
					height: "190px",
				}}
				race
				invert
			></NamePlate>
			<VideoFrame xInset={1547} yInset={115} wInset={354} hInset={265} />
			<VideoFrame xInset={1193} yInset={384} wInset={708} hInset={531} />
			<NamePlate
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "180px",
					left: "1189px",
					width: "344px",
					height: "190px",
				}}
				race
				invert
			></NamePlate>
		</VerticalRaceTemplate>
	);
};
