import {FunctionComponent} from "react";
import {Camera} from "../../../components/camera";
import {EventLogo} from "../../../components/event-logo";
import {SemiHorizontalGameInfo} from "../../../components/game-info/semi-horizontal";
import {RoundedHoleImage} from "../../../components/rounded-hole-image";
import {Sponsor} from "../../../components/sponsor";
import background from "../../../images/background.png";
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
				color: "white",
			}}
		>
			<RoundedHoleImage
				src={background}
				height={1080}
				width={1920}
				roundedRect={{
					height: 300,
					width: 400,
					radius: 7,
					x: 1030,
					y: 715,
					border: {
						color: "white",
						width: 2,
					},
				}}
			></RoundedHoleImage>
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
