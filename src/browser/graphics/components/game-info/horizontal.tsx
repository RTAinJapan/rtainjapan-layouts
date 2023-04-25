import {BoldText, ThinText} from "../lib/text";
import {useCurrentRun} from "../lib/hooks";
import {Divider} from "../lib/divider";
import {FitText} from "../lib/fit-text";
import {CSSProperties} from "react";
import {GameTimer} from "../lib/timer";

export const HorizontalGameInfo = (props: {style?: CSSProperties}) => {
	const currentRun = useCurrentRun();
	return (
		<div
			style={{
				display: "grid",
				placeContent: "stretch",
				placeItems: "center",
				gridTemplateColumns: "4px 1fr 4px auto 4px auto 4px",
				gap: "30px",
				lineHeight: "normal",
				...props.style,
			}}
		>
			<Divider></Divider>
			<FitText defaultSize={60}>
				{currentRun?.titleLines.map((line) => (
					<BoldText>{line}</BoldText>
				))}
			</FitText>
			<Divider></Divider>
			<ThinText
				style={{
					fontSize: "22px",
					display: "grid",
					gridTemplateRows: "auto auto",
					alignContent: "center",
					justifyItems: "start",
				}}
			>
				<FitText defaultSize={22}>
					{currentRun?.category?.split("\\n").map((line) => (
						<ThinText>{line}</ThinText>
					))}
				</FitText>
				<div>
					{currentRun?.platform} - {currentRun?.releaseYear}
				</div>
			</ThinText>
			<Divider></Divider>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					alignContent: "center",
					alignItems: "center",
					gap: "15px",
				}}
			>
				<GameTimer fontSize={70}></GameTimer>
				<ThinText
					style={{
						display: "grid",
						gridTemplateRows: "auto auto",
						alignContent: "center",
						justifyItems: "center",
					}}
				>
					<div style={{fontSize: "20px"}}>予定タイム</div>
					<div style={{fontSize: "24px"}}>{currentRun?.runDuration}</div>
				</ThinText>
			</div>
			<Divider></Divider>
		</div>
	);
};
