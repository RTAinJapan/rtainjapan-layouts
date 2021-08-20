import {CSSProperties} from "react";
import {Timer} from "../../../../nodecg/replicants";
import {text} from "../../styles/colors";
import {useTimer} from "./hooks";
import {TimerText} from "./text";

const stateToColor = (state: Timer["timerState"]) => {
	switch (state) {
		case "Running":
			return text.timerRunning;
		case "Stopped":
			return text.timerPaused;
		case "Finished":
			return text.timerFinished;
	}
};

export const GameTimer = (props: {fontSize: number; style?: CSSProperties}) => {
	const timer = useTimer();
	if (!timer) {
		return null;
	}

	let color = stateToColor(timer.timerState);
	if (
		timer.results.length >= 1 &&
		timer.results.every((result) => result?.["forfeit"])
	) {
		color = text.timerPaused;
	}

	return (
		<TimerText
			style={{
				fontSize: `${props.fontSize}px`,
				lineHeight: `${props.fontSize}px`,
				transform: `translateY(-${props.fontSize / 10}px)`,
				color,
				...props.style,
			}}
		>
			{timer?.formatted}
		</TimerText>
	);
};
