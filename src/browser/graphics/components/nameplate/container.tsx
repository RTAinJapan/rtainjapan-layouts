import runnerImage from "../../images/header_runner.svg";
import commentatorImage from "../../images/header_commentary.svg";
import headerLineImage from "../../images/header_underline.svg";

export const NameplateContainer = ({
	children,
	variant = "none",
	direction = "column",
}: {
	children: React.ReactNode;
	variant?: "runner" | "commentator" | "none";
	direction?: "row" | "column";
}) => {
	const headerImage =
		variant === "runner"
			? runnerImage
			: variant === "commentator"
			? commentatorImage
			: null;

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "200px 1fr",
				gridTemplateRows: `${variant === "none" ? "0" : "30px"} 10px auto`,
			}}
		>
			{variant !== "none" && headerImage && (
				<img
					src={headerImage}
					height={30}
					width={200}
					style={{
						gridColumn: "1 / 2",
						gridRow: "1 / 2",
					}}
				/>
			)}

			{variant !== "none" && (
				<img
					src={headerLineImage}
					style={{
						width: "100%",
						height: "100%",
						gridColumn: "2 / 3",
						gridRow: "1 / 2",
						objectFit: "fill",
					}}
				/>
			)}

			<div
				style={{
					gridColumn: "1 / 3",
					gridRow: "3 / 4",
					display: "flex",
					flexDirection: direction,
					gap: "10px",
					paddingLeft: direction === "column" ? "30px" : undefined,
				}}
			>
				{children}
			</div>
		</div>
	);
};
