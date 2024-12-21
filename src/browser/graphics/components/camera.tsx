import {CSSProperties, FunctionComponent} from "react";
import {background, border} from "../styles/colors";
import iconNoCamera from "../images/icon/icon_nocamera.svg";
import {useCurrentRun} from "./lib/hooks";

type CameraSetting = "camera" | "no-camera" | "empty";

type CameraSettings =
	| [CameraSetting]
	| [CameraSetting, CameraSetting]
	| [CameraSetting, CameraSetting, CameraSetting, CameraSetting];

const SingleCamera = ({
	camera,
	borderWidth,
	borderRadius,
	style,
}: {
	camera: CameraSetting;
	borderWidth: string;
	borderRadius: string;
	style?: CSSProperties;
}) => {
	if (camera === "empty") {
		return (
			<div
				style={{
					borderColor: border.camera,
					borderStyle: "solid",
					borderWidth,
					borderRadius,
					placeSelf: "stretch",
					...style,
				}}
			></div>
		);
	}
	if (camera === "no-camera") {
		return (
			<div
				style={{
					background: background.camera,
					borderColor: border.camera,
					borderStyle: "solid",
					borderWidth,
					borderRadius,
					placeSelf: "stretch",
					display: "grid",
					placeContent: "stretch",
					placeItems: "center",
					...style,
				}}
			>
				<img src={iconNoCamera} height={60} width={60}></img>
			</div>
		);
	}
	return (
		<div
			style={{
				borderColor: border.camera,
				borderStyle: "solid",
				borderWidth,
				borderRadius,
				placeSelf: "stretch",
				display: "grid",
				placeContent: "stretch",
				placeItems: "stretch",
				...style,
			}}
		></div>
	);
};

const CameraContent = ({cameras}: {cameras: CameraSettings}) => {
	if (cameras.length === 1) {
		return (
			<SingleCamera
				camera={cameras[0]}
				borderWidth='0'
				borderRadius='7px'
				style={{gridColumn: "1 / 3", gridRow: "1 / 3"}}
			></SingleCamera>
		);
	}
	if (cameras.length === 2) {
		return (
			<>
				<SingleCamera
					camera={cameras[0]}
					borderWidth='0'
					borderRadius='7px 0 0 7px'
					style={{gridColumn: "1 / 2", gridRow: "1 / 3"}}
				></SingleCamera>
				<SingleCamera
					camera={cameras[1]}
					borderWidth='0'
					borderRadius='0 7px 7px 0'
					style={{gridColumn: "2 / 3", gridRow: "1 / 3"}}
				></SingleCamera>
			</>
		);
	}
	return (
		<>
			<SingleCamera
				camera={cameras[0]}
				borderWidth='0'
				borderRadius='7px 0 0 0'
				style={{gridColumn: "1 / 2", gridRow: "1 / 2"}}
			></SingleCamera>
			<SingleCamera
				camera={cameras[1]}
				borderWidth='0'
				borderRadius='0 7px 0 0'
				style={{gridColumn: "2 / 3", gridRow: "1 / 2"}}
			></SingleCamera>
			<SingleCamera
				camera={cameras[2]}
				borderWidth='0'
				borderRadius='0 0 0 7px'
				style={{gridColumn: "1 / 2", gridRow: "2 / 3"}}
			></SingleCamera>
			<SingleCamera
				camera={cameras[3]}
				borderWidth='0'
				borderRadius='0 0 7px 0'
				style={{gridColumn: "2 / 3", gridRow: "2 / 3"}}
			></SingleCamera>
		</>
	);
};

const calcCameraSetting = (bool?: boolean) => (bool ? "camera" : "no-camera");

const useCameraSettings = (): CameraSettings => {
	const currentRun = useCurrentRun();
	const cameras = currentRun?.runners.map((runner) => runner.camera);

	if (!cameras) {
		return ["empty"];
	}

	if (cameras.length === 4) {
		return [
			calcCameraSetting(cameras[0]),
			calcCameraSetting(cameras[1]),
			calcCameraSetting(cameras[2]),
			calcCameraSetting(cameras[3]),
		];
	}
	if (cameras.length === 3) {
		return [
			"empty",
			calcCameraSetting(cameras[0]),
			calcCameraSetting(cameras[1]),
			calcCameraSetting(cameras[2]),
		];
	}
	if (cameras.length === 2) {
		return [calcCameraSetting(cameras[0]), calcCameraSetting(cameras[1])];
	}
	return [calcCameraSetting(cameras[0])];
};

export const Camera: FunctionComponent<{
	style?: CSSProperties;
}> = (props) => {
	const settings = useCameraSettings();
	return (
		<div
			style={{
				border: `2px ${border.camera} solid`,
				borderRadius: "7px",
				display: "grid",
				gridAutoFlow: "column",
				gridTemplateColumns: "1fr 1fr",
				gridTemplateRows: "1fr 1fr",
				...props.style,
			}}
		>
			<CameraContent cameras={settings}></CameraContent>
		</div>
	);
};
