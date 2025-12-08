import {ThinText} from "../lib/text";
import {useCurrentRun} from "../lib/hooks";
import {Divider} from "../lib/divider";
import {FitText} from "../lib/fit-text";
import {CSSProperties} from "react";
import {GameTimer} from "../lib/timer";

type CellProps = {
	main: React.ReactNode;
	sub: React.ReactNode;
};

const InfoCell = (props: CellProps) => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "grid",
				placeContent: "stretch",
				placeItems: "center",
				gridTemplateRows: "70px 30px",
				alignItems: "center",
			}}
		>
			{props.main}
			{props.sub}
		</div>
	);
};

export const HorizontalGameInfo = (props: {style?: CSSProperties}) => {
	const currentRun = useCurrentRun();
	return (
		<div
			style={{
				display: "grid",
				placeContent: "stretch",
				placeItems: "center",
				gridTemplateColumns: "1fr 4px 290px",
				gap: "30px",
				lineHeight: "normal",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
				borderRadius: "20px",
				padding: "10px 20px",
				...props.style,
			}}
		>
			<InfoCell
				main={<FitText defaultSize={50}>{currentRun?.title}</FitText>}
				sub={
					<FitText defaultSize={22} thin>
						{`${currentRun?.category}\n${currentRun?.platform} - ${currentRun?.releaseYear}`}
					</FitText>
				}
			></InfoCell>
			<Divider></Divider>
			<InfoCell
				main={<GameTimer fontSize={65}></GameTimer>}
				sub={
					<ThinText style={{fontSize: "22px"}}>
						予定タイム {currentRun?.runDuration}
					</ThinText>
				}
			></InfoCell>
		</div>
	);
};
