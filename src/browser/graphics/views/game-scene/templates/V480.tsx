import {EventLogo} from "../../../components/event-logo";
import background from "./background/background-L480.png";
import {VerticalGameInfo} from "../../../components/game-info/vertical";
import {FunctionComponent} from "react";
import {useVerticalGameInfo} from "./vertical-gameinfo";

export const TemplateV480: FunctionComponent = ({children}) => {
	const gameInfo = useVerticalGameInfo({
		race: true,
		width: "480px",
		height: "650px",
		cameraHeight: "270px",
		cameraHeightRace: "270px",
		nameplateWidth: "450px",
		limitOneCommentator: true,
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
