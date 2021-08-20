import {EventLogo} from "../../../components/event-logo";
import {HorizontalGameInfo} from "../../../components/game-info/horizontal";
import background from "./background/background-L480.png";
import backgroundRace from "./background/background-L480-race.png";
import {FunctionComponent} from "react";
import {useVerticalGameInfo} from "./vertical-gameinfo";

export const TemplateL480: FunctionComponent<{
	race?: boolean;
	hideGameInfo?: boolean;
}> = ({children, race, hideGameInfo}) => {
	const gameInfo = useVerticalGameInfo({
		race,
		width: "480px",
		height: "865px",
		cameraHeight: "270px",
		cameraHeightRace: "335px",
		nameplateWidth: "450px",
	});
	return (
		<div
			style={{
				position: "absolute",
				overflow: "hidden",
				width: "1920px",
				height: "1030px",
				backgroundImage: `url(${race ? backgroundRace : background})`,
				color: "white",
			}}
		>
			<EventLogo style={{top: 0, left: 0}}></EventLogo>
			{gameInfo}
			{hideGameInfo ?? (
				<HorizontalGameInfo
					style={{
						position: "absolute",
						left: "510px",
						top: "930px",
						width: "1395px",
						height: "85px",
					}}
				></HorizontalGameInfo>
			)}
			{children}
		</div>
	);
};
