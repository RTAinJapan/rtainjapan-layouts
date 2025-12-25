import {FunctionComponent, PropsWithChildren, useRef} from "react";
import {Camera, makeCameraPosition} from "../../../components/camera";
import {EventLogo} from "../../../components/event-logo";
import {
	makeRoundedRect,
	RoundedHoleImage,
} from "../../../components/rounded-hole-image";
import {text} from "../../../styles/colors";
import background from "../../../images/background.png";
import {useFitViewport} from "../../../components/lib/use-fit-viewport";
import {HorizontalGameInfo} from "../../../components/game-info/horizontal";
import {NameplateContainer} from "../../../components/nameplate/container";
import {useCommentators} from "../../../components/lib/hooks";
import {NamePlate} from "../../../components/nameplate";

type Props = PropsWithChildren;

export const HorizontalRaceTemplate: FunctionComponent<Props> = ({
	children,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);
	const commentators = useCommentators();

	const cameraInsetPos = [1477, 752, 428, 263] as const;

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
				roundedRect={makeRoundedRect(...cameraInsetPos, 0, 4)}
			></RoundedHoleImage>
			<HorizontalGameInfo
				style={{
					position: "absolute",
					top: "752px",
					left: "15px",
					height: "120px",
					width: "1447px",
				}}
			/>
			<EventLogo
				style={{position: "absolute", top: "875px", left: 0}}
			></EventLogo>
			{commentators.length > 0 && (
				<NameplateContainer
					variant='commentator'
					direction='row'
					style={{
						position: "absolute",
						right: "458px",
						top: "895px",
					}}
				>
					{commentators.map(
						(commentator, index) =>
							commentator && (
								<NamePlate
									kind='commentators'
									key={commentator.name}
									index={index}
									style={{width: "398px"}}
								></NamePlate>
							),
					)}
				</NameplateContainer>
			)}
			<Camera
				style={{
					position: "absolute",
					...makeCameraPosition(...cameraInsetPos),
				}}
			></Camera>
			{children}
		</div>
	);
};
