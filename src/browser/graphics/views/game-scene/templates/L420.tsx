import {EventLogo} from "../../../components/event-logo";
import {HorizontalGameInfo} from "../../../components/game-info/horizontal";
import background from "../../../images/background.png";
import {FunctionComponent} from "react";
import {useVerticalGameInfo} from "./vertical-gameinfo";
import {RoundedHoleImage} from "../../../components/rounded-hole-image";

export const TemplateL420: FunctionComponent<{
	race?: boolean;
	hideGameInfo?: boolean;
}> = ({children, race, hideGameInfo}) => {
	const gameInfo = useVerticalGameInfo({
		race,
		width: "420px",
		height: "865px",
		cameraHeight: "300px",
		cameraHeightRace: "300px",
		nameplateWidth: "390px",
	});
	return (
		<div
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
					height: 300,
					width: 420,
					radius: 7,
					x: 15,
					y: 150,
					border: {
						color: "white",
						width: 2,
					},
				}}
			></RoundedHoleImage>

			<EventLogo style={{top: 0, left: 0, position: "absolute"}}></EventLogo>
			{gameInfo}
			{hideGameInfo ?? (
				<HorizontalGameInfo
					style={{
						position: "absolute",
						top: "930px",
						left: "450px",
						width: "1455px",
						height: "85px",
					}}
				></HorizontalGameInfo>
			)}
			{children}
		</div>
	);
};
