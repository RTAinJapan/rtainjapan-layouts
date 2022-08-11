import "modern-normalize";
import ReactDOM from "react-dom";
import {TimerText} from "../components/lib/text";
import {Music} from "../components/music";
import rchan from "../images/rchan_count.webm";
import bg from "../images/background.png";
import {useReplicant} from "../../use-replicant";
import {useEffect, useState} from "react";
import moment from "moment";

const App = () => {
	const countdown = useReplicant("countdown");
	const [text, setText] = useState("00:00");

	useEffect(() => {
		if (countdown?.state !== "running") {
			return;
		}
		const interval = setInterval(() => {
			const remainingTime = countdown.endTime - Date.now();
			if (remainingTime < 0) {
				setText("00:00");
			} else {
				const duration = moment.duration(remainingTime);
				const hours = duration.hours();
				const minutes = duration.minutes().toString().padStart(2, "0");
				const seconds = duration.seconds().toString().padStart(2, "0");
				if (hours >= 1) {
					setText([hours, minutes, seconds].join(":"));
				} else {
					setText([minutes, seconds].join(":"));
				}
			}
		}, 100);
		return () => {
			clearInterval(interval);
		};
	}, [countdown]);

	if (!countdown) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				width: "1920px",
				height: "1080px",
				overflow: "hidden",
				background: `url(${bg})`,
				color: "white",
			}}
		>
			<TimerText
				style={{
					position: "absolute",
					top: "200px",
					left: "200px",
					width: "1520px",
					height: "320px",
					display: "grid",
					placeContent: "center",
					placeItems: "center",
					fontSize: "300px",
					textShadow: "0 0 10px black",
				}}
			>
				{text}
			</TimerText>
			<video
				autoPlay
				muted
				loop
				src={rchan}
				style={{
					position: "absolute",
					top: "520px",
					left: "560px",
					width: "800px",
					height: "560px",
				}}
			></video>
			<Music></Music>
		</div>
	);
};

ReactDOM.render(<App></App>, document.getElementById("root"));
