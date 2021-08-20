import {FunctionComponent} from "react";
import {Camera} from "../../../components/camera";
import {EventLogo} from "../../../components/event-logo";
import {SemiHorizontalGameInfo} from "../../../components/game-info/semi-horizontal";
import {Sponsor} from "../../../components/sponsor";
import background from "./background/background-H300.png";
import {HorizontalNamePlates} from "./horizontal-nameplates";

export const TemplateH300: FunctionComponent<{race?: boolean}> = ({
	children,
	race,
}) => {
	return (
		<div
			style={{
				position: "absolute",
				width: "1920px",
				height: "1030px",
				overflow: "hidden",
				backgroundImage: `url(${background})`,
				color: "white",
			}}
		>
			<SemiHorizontalGameInfo
				height={150}
				style={{
					position: "absolute",
					top: "715px",
					left: "15px",
					height: "150px",
					width: "1000px",
				}}
			></SemiHorizontalGameInfo>
			<EventLogo
				style={{position: "absolute", top: "895px", left: 0}}
			></EventLogo>
			<HorizontalNamePlates race={race}></HorizontalNamePlates>
			<Camera
				style={{
					position: "absolute",
					top: "715px",
					left: "1030px",
					width: "400px",
					height: "300px",
				}}
			></Camera>

			<Sponsor
				kind='horizontal'
				style={{
					position: "absolute",
					top: "715px",
					left: "1445px",
					width: "460px",
					height: "300px",
				}}
			></Sponsor>
			{children}
		</div>
	);
};
