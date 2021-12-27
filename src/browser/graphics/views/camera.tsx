import "modern-normalize";
import gsap from "gsap";
import ReactDOM from "react-dom";
import topLogo from "../images/header_rij.svg";
import background from "../images/background.png";
import {RoundedHoleImage} from "../components/rounded-hole-image";
import logoR from "../images/speech_nameplate.svg";
import {BoldText} from "../components/lib/text";
import {Divider} from "../components/lib/divider";
import {useReplicant} from "../../use-replicant";
import {RefObject, useEffect, useRef} from "react";
import {swipeEnter, swipeExit} from "../components/lib/blur-swipe";
import {CameraState} from "../../../nodecg/replicants";

const BigNameplate = (props: {innerRef?: RefObject<HTMLDivElement>}) => {
	const camera = useReplicant("camera-name");
	return (
		<div
			ref={props.innerRef}
			style={{
				position: "absolute",
				display: "grid",
				gridTemplateRows: "8px 32px 86px 10px 6px 18px",
				gridTemplateColumns: "160px auto 80px 80px",
				left: "50%",
				bottom: "183px",
				transform: "translateX(-50%)",
				WebkitMaskImage:
					"linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)",
			}}
		>
			<img
				src={logoR}
				style={{
					gridColumn: "1 / 2",
					gridRow: "1 / last-line",
				}}
			></img>
			<BoldText
				style={{
					gridColumn: "2 / 3",
					gridRow: "3 / 4",
					alignSelf: "center",
					justifySelf: "start",
					fontSize: "80px",
					textShadow: "0 0 10px black",
				}}
			>
				{camera?.name}
			</BoldText>
			<Divider
				style={{
					gridColumn: "2 / 4",
					gridRow: "5 / 6",
					placeSelf: "stretch",
					boxShadow: "0 0 10px black",
				}}
			></Divider>
		</div>
	);
};

const SmallNameplate = (props: {innerRef?: RefObject<HTMLDivElement>}) => {
	const camera = useReplicant("camera-name");

	return (
		<div
			ref={props.innerRef}
			style={{
				position: "absolute",
				bottom: "183px",
				right: "276px",
				display: "grid",
				gridTemplateColumns: "20px 40px auto 40px 20px",
				gridTemplateRows: "66px 10px 6px 18px",
				margin: "0 10px",
			}}
		>
			<div
				style={{
					gridColumn: "3 / 4",
					gridRow: "1 / 2",
					display: "grid",
					gridAutoFlow: "column",
					gap: "20px",
					alignItems: "end",
				}}
			>
				{camera?.title && (
					<BoldText style={{fontSize: "24px", textShadow: "0 0 10px black"}}>
						{camera.title}
					</BoldText>
				)}
				<BoldText style={{fontSize: "60px", textShadow: "0 0 10px black"}}>
					{camera?.name}
				</BoldText>
			</div>
			<Divider
				style={{
					gridRow: "3 / 4",
					gridColumn: "2 / span 3",
					boxShadow: "0 0 10px black",
				}}
			></Divider>
		</div>
	);
};

const cameraStateRep = nodecg.Replicant("camera-state");
const App = () => {
	const bigNameRef = useRef<HTMLDivElement>(null);
	const smallNameRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const listener = (newVal: CameraState) => {
			switch (newVal) {
				case "hidden":
					swipeExit(smallNameRef);
					break;
				case "big":
					swipeEnter(bigNameRef);
					break;
				case "small": {
					const tl = gsap.timeline();
					tl.add(swipeExit(bigNameRef));
					tl.add(swipeEnter(smallNameRef), "+=0.3");
				}
			}
		};
		cameraStateRep.on("change", listener);
		return () => {
			cameraStateRep.removeListener("change", listener);
		};
	}, []);

	return (
		<div
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
					x: 216,
					y: 100,
					width: 1488,
					height: 837,
					radius: 21,
					border: {
						color: "white",
						width: 2,
					},
				}}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
				}}
			></RoundedHoleImage>
			<img
				src={topLogo}
				style={{
					position: "absolute",
					top: "20px",
					left: "30px",
				}}
			></img>
			<BigNameplate innerRef={bigNameRef}></BigNameplate>
			<SmallNameplate innerRef={smallNameRef}></SmallNameplate>
		</div>
	);
};

ReactDOM.render(<App></App>, document.getElementById("root"));
