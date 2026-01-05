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
import {NameplateContainer} from "../../../components/nameplate/container";
import {useCommentators} from "../../../components/lib/hooks";
import {NamePlate} from "../../../components/nameplate";
import {VerticalGameInfo} from "../../../components/game-info/vertical";
import {InGameDonationPopup} from "../../../components/donation-message/in-game-popup";

type Props = PropsWithChildren;

export const VerticalRaceTemplate: FunctionComponent<Props> = ({children}) => {
	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);
	const commentators = useCommentators();

	const cameraInsetPos = [19, 756, 420, 255] as const;

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
			<VerticalGameInfo
				style={{
					position: "absolute",
					top: "240px",
					left: "15px",
					width: "428px",
					height: "240px",
				}}
			/>
			<EventLogo style={{position: "absolute", top: 0, left: 0}}></EventLogo>
			<div
				style={{
					position: "absolute",
					bottom: "298px",
					left: "15px",
					width: "428px",
					height: "210px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "end",
					gap: "10px",
				}}
			>
				{commentators.length > 0 && (
					<NameplateContainer variant='commentator'>
						{commentators.map(
							(commentator, index) =>
								commentator && (
									<NamePlate
										kind='commentators'
										key={commentator.name}
										index={index}
									></NamePlate>
								),
						)}
					</NameplateContainer>
				)}
			</div>
			<Camera
				style={{
					position: "absolute",
					...makeCameraPosition(...cameraInsetPos),
				}}
			></Camera>
			<InGameDonationPopup
				rows={4}
				style={{
					position: "absolute",
					top: "20px",
					left: "118px",
					width: "325px",
					maxHeight: "203px",
				}}
			/>
			{children}
		</div>
	);
};
