import "modern-normalize";
import "../styles/adobe-fonts.js";

import background from "../images/background.png";
import {RoundedHoleImage} from "../components/rounded-hole-image";
import {BoldText} from "../components/lib/text";
import {Divider} from "../components/lib/divider";
import {useReplicant} from "../../use-replicant";
import {RefObject, useEffect, useRef} from "react";
import {swipeEnter, swipeExit} from "../components/lib/blur-swipe";
import {CameraState} from "../../../nodecg/replicants";
import {useFitViewport} from "../components/lib/use-fit-viewport";
import {render} from "../../render.js";
import {border} from "../styles/colors.js";
import {EventLogo} from "../components/event-logo.js";
import frame from "../images/speech_frame.png";

const SmallNameplate = (props: {
	innerRef?: RefObject<HTMLDivElement | null>;
}) => {
	const camera = useReplicant("camera-name");

	return (
		<div
			ref={props.innerRef}
			style={{
				position: "absolute",
				top: "760px",
				right: "460px", // 480px - 20px
				display: "grid",
				gridTemplateColumns: "20px 40px auto 40px 20px",
				gridTemplateRows: "66px 8px 6px 18px",
				overflow: "visible",
			}}
		>
			<div
				style={{
					gridColumn: "3 / 4",
					gridRow: "1 / 2",
					display: "grid",
					gridAutoFlow: "column",
					gap: "20px",
					alignItems: "baseline",
				}}
			>
				{camera?.title && (
					<BoldText
						style={{
							fontSize: "24px",
							textShadow: "0 0 5px black, 0 0 10px black, 0 0 20px black",
						}}
					>
						{camera.title}
					</BoldText>
				)}
				<BoldText
					style={{
						fontSize: "60px",
						textShadow: "0 0 5px black, 0 0 10px black, 0 0 20px black",
					}}
				>
					{camera?.name}
				</BoldText>
			</div>
			<Divider
				style={{
					gridRow: "3 / 4",
					gridColumn: "2 / 5",
					boxShadow: "0 0 5px black, 0 0 10px black, 0 0 20px black",
					backgroundColor: border.speechName,
				}}
			></Divider>
		</div>
	);
};

const cameraStateRep = nodecg.Replicant("camera-state");
const App = () => {
	const smallNameRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const listener = (newVal: CameraState) => {
			switch (newVal) {
				case "hidden":
					swipeExit(smallNameRef);
					break;
				case "small": {
					swipeEnter(smallNameRef);
				}
			}
		};
		cameraStateRep.on("change", listener);
		return () => {
			cameraStateRep.removeListener("change", listener);
		};
	}, []);

	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);

	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				width: "1920px",
				height: "1080px",
				color: "white",
			}}
		>
			<RoundedHoleImage
				src={background}
				width={1920}
				height={1080}
				roundedRect={{
					x: 236,
					y: 96,
					width: 1448,
					height: 818,
					radius: 0,
					border: {
						color: border.speechCamera,
						width: 4,
					},
				}}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
				}}
			></RoundedHoleImage>
			<EventLogo
				style={{
					position: "absolute",
					top: "15px",
					left: "15px",
				}}
			/>
			<img
				src={frame}
				style={{
					position: "absolute",
					top: "600px",
					left: "120px",
				}}
			/>
			<SmallNameplate innerRef={smallNameRef}></SmallNameplate>
		</div>
	);
};

render(<App />);
