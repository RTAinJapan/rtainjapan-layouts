import {ThinText} from "../lib/text";
import {useCurrentRun} from "../lib/hooks";
import {Divider} from "../lib/divider";
import {CSSProperties} from "react";
import {FitText} from "../lib/fit-text";
import {GameTimer} from "../lib/timer";

/** 特殊変形時のゲームタイトル枠背景 */
const gradientBackground = `
	linear-gradient(
		to right,
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0.4) 20%,
		rgba(0, 0, 0, 0.5) 50%,
		rgba(0, 0, 0, 0.4) 80%,
		rgba(0, 0, 0, 0) 100%
	)
`;

export const VerticalGameInfo = ({
	wide,
	bg,
	style,
}: {
	wide?: boolean;
	bg?: boolean;
	style?: CSSProperties;
}) => {
	const currentRun = useCurrentRun();
	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: wide
					? "95px 4px 50px 4px 85px"
					: "85px 4px 40px 4px 67px",
				placeContent: "stretch",
				placeItems: "center",
				background: bg ? gradientBackground : "",
				...style,
			}}
		>
			<FitText
				style={{
					padding: wide ? "0 40px" : "0 15px",
				}}
				defaultSize={wide ? 60 : 50}
			>
				{currentRun?.title}
			</FitText>
			<Divider gradient={bg}></Divider>

			<FitText
				style={{
					padding: wide ? "0 40px" : "0 15px",
				}}
				defaultSize={22}
				thin
			>
				{`${currentRun?.category} - ${currentRun?.platform} - ${currentRun?.releaseYear}`}
			</FitText>

			<Divider gradient={bg}></Divider>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					alignContent: "stretch",
					justifyContent: "center",
					placeItems: "center",
					gap: "15px",
					padding: wide ? "0 40px" : "0 15px",
				}}
			>
				<ThinText
					style={{
						display: "grid",
						gridTemplateRows: "auto auto",
						placeContent: "center",
						placeItems: "center",
					}}
				>
					<div style={{fontSize: wide ? "22px" : "18px"}}>予定タイム</div>
					<div style={{fontSize: wide ? "24px" : "22px"}}>
						{currentRun?.runDuration}
					</div>
				</ThinText>
				<GameTimer fontSize={60}></GameTimer>
			</div>
		</div>
	);
};
