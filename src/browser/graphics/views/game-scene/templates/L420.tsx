import {EventLogo} from "../../../components/event-logo";
import {HorizontalGameInfo} from "../../../components/game-info/horizontal";
import background from "./background/background-L420.png";
import {FunctionComponent} from "react";
import {useVerticalGameInfo} from "./vertical-gameinfo";

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
				backgroundImage: `url(${background})`,
				color: "white",
			}}
		>
			<EventLogo style={{top: 0, left: 0}}></EventLogo>
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
