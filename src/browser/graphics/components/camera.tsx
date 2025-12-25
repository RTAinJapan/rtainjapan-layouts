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
	style,
}: {
	camera: CameraSetting;
	style?: CSSProperties;
}) => {
	if (camera === "empty") {
		return (
			<div
				style={{
					borderColor: border.camera,
					borderStyle: "solid",
					borderWidth: "0",
					borderRadius: "0",
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
					borderWidth: "0",
					borderRadius: "20px",
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
				borderWidth: "4px",
				borderRadius: "0",
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
	return (
		<SingleCamera
			camera={cameras[0]}
			style={{gridColumn: "1 / 3", gridRow: "1 / 3"}}
		></SingleCamera>
	);
};

const calcCameraSetting = (bool?: boolean) => (bool ? "camera" : "no-camera");

const useCameraSettings = (): CameraSettings => {
	const currentRun = useCurrentRun();
	const cameras = currentRun?.runners.map((runner) => runner.camera);

	if (!cameras) {
		return ["no-camera"];
	}

	return [calcCameraSetting(cameras[0])];
};

export const makeCameraPosition = (
	xInset: number,
	yInset: number,
	wInset: number,
	hInset: number,
) => ({
	// top: `${yInset - 4}px`,
	// left: `${xInset - 4}px`,
	// width: `${wInset + 8}px`,
	// height: `${hInset + 8}px`,
	top: `${yInset}px`,
	left: `${xInset}px`,
	width: `${wInset}px`,
	height: `${hInset}px`,
});

export const Camera: FunctionComponent<{
	style?: CSSProperties;
}> = (props) => {
	const settings = useCameraSettings();
	return (
		<div
			style={{
				borderRadius: "0px",
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
