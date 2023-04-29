import {EventLogo} from "../../../components/event-logo";
import background from "../../../images/background.png";
import {VerticalGameInfo} from "../../../components/game-info/vertical";
import {FunctionComponent, useRef} from "react";
import {useVerticalGameInfo} from "./vertical-gameinfo";
import {RoundedHoleImage} from "../../../components/rounded-hole-image";
import {useFitViewport} from "../../../components/lib/use-fit-viewport";

export const TemplateV480: FunctionComponent = ({children}) => {
	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);
	const gameInfo = useVerticalGameInfo({
		race: true,
		width: "480px",
		height: "650px",
		cameraHeight: "270px",
		cameraHeightRace: "270px",
		nameplateWidth: "450px",
		limitOneCommentator: false,
	});
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				overflow: "hidden",
				width: "1920px",
				height: "1030px",
				color: "white",
			}}
		>
			<RoundedHoleImage
				src={background}
				height={1080}
				width={1920}
				roundedRect={{
					height: 270,
					width: 480,
					radius: 7,
					x: 15,
					y: 150,
					border: {
						color: "white",
						width: 2,
					},
				}}
			></RoundedHoleImage>
			<EventLogo style={{position: "absolute", top: 0, left: 0}}></EventLogo>
			{gameInfo}
			<VerticalGameInfo
				style={{
					position: "absolute",
					top: "815px",
					left: "15px",
					width: "480px",
					height: "200px",
				}}
			></VerticalGameInfo>
			{children}
		</div>
	);
};
