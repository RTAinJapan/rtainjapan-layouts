import {EventLogo} from "../../../components/event-logo";
import {HorizontalGameInfo} from "../../../components/game-info/horizontal";
import background from "../../../images/background.png";
import {FunctionComponent, PropsWithChildren, useRef} from "react";
import {useVerticalGameInfo} from "./vertical-gameinfo";
import {RoundedHoleImage} from "../../../components/rounded-hole-image";
import {useFitViewport} from "../../../components/lib/use-fit-viewport";

type Props = PropsWithChildren<{
	race: boolean;
	hideGameInfo?: boolean;
}>;

export const TemplateL480: FunctionComponent<Props> = ({
	children,
	race,
	hideGameInfo,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);
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
			ref={ref}
			style={{
				position: "absolute",
				overflow: "hidden",
				width: "1920px",
				height: "1030px",
				color: "white",
				backgroundColor: import.meta.env.DEV ? "magenta" : undefined,
			}}
		>
			<RoundedHoleImage
				src={background}
				height={1080}
				width={1920}
				roundedRect={{
					height: race ? 335 : 270,
					width: 480,
					radius: 7,
					x: 15,
					y: 150,
				}}
			></RoundedHoleImage>
			<EventLogo style={{top: 0, left: 0, position: "absolute"}}></EventLogo>
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
