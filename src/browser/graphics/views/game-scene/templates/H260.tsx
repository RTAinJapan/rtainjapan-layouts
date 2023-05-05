import {FunctionComponent, PropsWithChildren, useRef} from "react";
import {Camera} from "../../../components/camera";
import {EventLogo} from "../../../components/event-logo";
import {SemiHorizontalGameInfo} from "../../../components/game-info/semi-horizontal";
import {RoundedHoleImage} from "../../../components/rounded-hole-image";
import {Sponsor} from "../../../components/sponsor";
import {text} from "../../../styles/colors";
import background from "../../../images/background.png";
import {HorizontalNamePlates} from "./horizontal-nameplates";
import {useFitViewport} from "../../../components/lib/use-fit-viewport";

type Props = PropsWithChildren<{race?: boolean}>;

export const TemplateH260: FunctionComponent<Props> = ({children, race}) => {
	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				overflow: "hidden",
				width: "1920px",
				height: "1030px",
				color: text.normal,
			}}
		>
			<RoundedHoleImage
				src={background}
				height={1080}
				width={1920}
				roundedRect={{
					height: 260,
					width: 400,
					radius: 7,
					x: 1030,
					y: 755,
					border: {
						color: "white",
						width: 2,
					},
				}}
			></RoundedHoleImage>
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
