import {CSSProperties} from "react";

/** 特殊変形時のゲームタイトル枠罫線 */
const gradientColor = `
	linear-gradient(
		to right,
		rgba(255, 255, 82, 0),
		rgba(255, 255, 82, 1) 20%,
		rgba(255, 255, 82, 1) 80%,
		rgba(255, 255, 82, 0) 100%
	)
`;

export const Divider = ({
	gradient,
	style,
}: {
	gradient?: boolean;
	style?: CSSProperties;
}) => (
	<div
		style={{
			alignSelf: "stretch",
			justifySelf: "stretch",
			background: gradient ? gradientColor : "rgb(255, 255, 82)",
			...style,
		}}
	></div>
);
