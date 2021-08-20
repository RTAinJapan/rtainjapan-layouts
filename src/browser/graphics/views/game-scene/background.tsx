import background from "./templates/background/background.png";
export default () => {
	return (
		<div
			style={{
				position: "absolute",
				width: "1920px",
				height: "1030px",
				overflow: "hidden",
				backgroundImage: `url(${background})`,
			}}
		></div>
	);
};
