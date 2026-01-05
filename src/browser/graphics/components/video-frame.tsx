import {border} from "../styles/colors";

export const VideoFrame = ({
	xInset,
	yInset,
	wInset,
	hInset,
	borderWidth = 4,
}: {
	xInset: number;
	yInset: number;
	wInset: number;
	hInset: number;
	borderWidth?: number;
}) => {
	return (
		<div
			style={{
				position: "absolute",
				top: `${yInset - borderWidth}px`,
				left: `${xInset - borderWidth}px`,
				width: `${wInset + borderWidth * 2}px`,
				height: `${hInset + borderWidth * 2}px`,
				borderStyle: "solid",
				borderWidth: `${borderWidth}px`,
				borderColor: border.game,
			}}
		></div>
	);
};
