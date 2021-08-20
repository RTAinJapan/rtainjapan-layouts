const gradientColor = `
	linear-gradient(
		to right,
		rgba(255, 255, 82, 0),
		rgba(255, 255, 82, 1) 20%,
		rgba(255, 255, 82, 1) 80%,
		rgba(255, 255, 82, 0) 100%
	)
`;

export const Divider = ({gradient}: {gradient?: boolean}) => (
	<div
		style={{
			alignSelf: "stretch",
			justifySelf: "stretch",
			background: gradient ? gradientColor : "rgb(255, 255, 82)",
		}}
	></div>
);
