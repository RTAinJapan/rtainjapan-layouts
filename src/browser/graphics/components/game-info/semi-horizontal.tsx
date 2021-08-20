import {ThinText} from "../lib/text";
import {useCurrentRun} from "../lib/hooks";
import {Divider} from "../lib/divider";
import {FitText} from "../lib/fit-text";
import {CSSProperties} from "react";
import {GameTimer} from "../lib/timer";

export const SemiHorizontalGameInfo = ({
	height = 150,
	style,
}: {
	height?: 130 | 150;
	style?: CSSProperties;
}) => {
	const currentRun = useCurrentRun();
	const verticalTemplate = height === 150 ? "90px 4px 56px" : "85px 4px 41px";
	return (
		<div
			style={{
				display: "grid",
				placeContent: "stretch",
				placeItems: "stretch",
				gridTemplateColumns: "4px 687px 4px 260px",
				gap: "15px",
				...style,
			}}
		>
			<Divider></Divider>

			<div
				style={{
					display: "grid",
					gridTemplateRows: verticalTemplate,
					placeContent: "stretch",
					placeItems: "center",
				}}
			>
				<div style={{display: "grid", gridTemplateColumns: "15px 1fr 15px"}}>
					<div></div>
					<FitText defaultSize={60}>{currentRun?.title}</FitText>
					<div></div>
				</div>
				<Divider></Divider>
				<div style={{display: "grid", gridTemplateColumns: "15px 1fr 15px"}}>
					<div></div>
					<FitText thin defaultSize={22}>
						{`${currentRun?.category} - ${currentRun?.platform} - ${currentRun?.releaseYear}`}
					</FitText>
					<div></div>
				</div>
			</div>

			<Divider></Divider>

			<div
				style={{
					display: "grid",
					gridTemplateRows: verticalTemplate,
					placeContent: "stretch",
					placeItems: "center",
				}}
			>
				<GameTimer fontSize={60}></GameTimer>
				<Divider></Divider>
				<ThinText style={{fontSize: "22px"}}>
					予定タイム {currentRun?.runDuration}
				</ThinText>
			</div>
		</div>
	);
};
