import {ThinText} from "../lib/text";
import {useCurrentRun} from "../lib/hooks";
import {Divider} from "../lib/divider";
import {CSSProperties} from "react";
import {FitText} from "../lib/fit-text";
import {GameTimer} from "../lib/timer";

const SubInfoCell = (props: {
	category: string;
	platform: string;
	releaseYear: string;
}) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: "23px 23px",
				width: "100%",
				alignItems: "center",
			}}
		>
			<FitText defaultSize={18} style={{lineHeight: "22px"}} thin>
				{props.category}
			</FitText>
			<ThinText
				style={{fontSize: "18px", lineHeight: "22px", textAlign: "center"}}
			>
				{`${props.platform} - ${props.releaseYear}`}
			</ThinText>
		</div>
	);
};

export const VerticalGameInfo = ({
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
				gridTemplateRows: "90px 46px 4px 70px",
				placeContent: "stretch",
				placeItems: "center",
				background: "rgba(0, 0, 0, 0.4)",
				borderRadius: "20px",
				padding: "15px 10px",
				rowGap: "5px",
				...style,
			}}
		>
			<FitText
				defaultSize={50}
				style={{
					padding: "0 10px",
					lineHeight: "1.1",
				}}
			>
				{currentRun?.title}
			</FitText>

			<SubInfoCell
				category={currentRun?.category ?? ""}
				platform={currentRun?.platform ?? ""}
				releaseYear={currentRun?.releaseYear?.toString() ?? ""}
			/>

			<Divider></Divider>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "104px 284px",
					alignContent: "stretch",
					justifyContent: "center",
					placeItems: "center",
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
					<div style={{fontSize: "18px", lineHeight: "22px"}}>予定タイム</div>
					<div style={{fontSize: "22px", lineHeight: "22px"}}>
						{currentRun?.runDuration}
					</div>
				</ThinText>
				<GameTimer fontSize={65}></GameTimer>
			</div>
		</div>
	);
};
