import {FunctionComponent} from "react";
import {Camera} from "../../../components/camera";
import {EventLogo} from "../../../components/event-logo";
import {SemiHorizontalGameInfo} from "../../../components/game-info/semi-horizontal";
import {Sponsor} from "../../../components/sponsor";
import {text} from "../../../styles/colors";
import background from "./background/background-H260.png";
import {HorizontalNamePlates} from "./horizontal-nameplates";

export const TemplateH260: FunctionComponent<{race?: boolean}> = ({
	children,
	race,
}) => {
	return (
		<div
			style={{
				position: "absolute",
				overflow: "hidden",
				width: "1920px",
				height: "1030px",
				backgroundImage: `url(${background})`,
				color: text.normal,
			}}
		>
			<SemiHorizontalGameInfo
				height={130}
				style={{
					position: "absolute",
					top: "755px",
					left: "15px",
					height: "130px",
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
					top: "755px",
					left: "1030px",
					width: "400px",
					height: "260px",
				}}
			></Camera>
			<Sponsor
				kind='horizontal'
				style={{
					position: "absolute",
					top: "755px",
					left: "1445px",
					width: "460px",
					height: "260px",
				}}
			></Sponsor>
			{children}
		</div>
	);
};
