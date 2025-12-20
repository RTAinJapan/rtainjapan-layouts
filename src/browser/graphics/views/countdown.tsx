import "modern-normalize";

import {TimerText} from "../components/lib/text";
import {Music} from "../components/music";
import bg from "../images/background.png";
import {useReplicant} from "../../use-replicant";
import {useEffect, useRef, useState} from "react";
import moment from "moment";
import {useFitViewport} from "../components/lib/use-fit-viewport";
import {render} from "../../render.js";
import rchan from "../images/countdown_anime.webm";
import {EventLogo} from "../components/event-logo";

const App = () => {
	const countdown = useReplicant("countdown");
	const [text, setText] = useState("00:00");

	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);

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
			ref={ref}
			style={{
				position: "absolute",
				width: "1920px",
				height: "1080px",
				overflow: "hidden",
				background: `url(${bg})`,
				color: "white",
			}}
		>
			<EventLogo
				style={{
					position: "absolute",
					top: "15px",
					left: "15px",
				}}
			/>
			<TimerText
				style={{
					position: "absolute",
					top: "240px",
					left: "240px",
					width: "1440px",
					height: "440px",
					display: "grid",
					placeContent: "center",
					placeItems: "center",
					fontSize: "440px",
					textShadow: "0 0 4px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 0, 0, 0.5)",
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
					top: "690px",
					left: "0px",
					width: "1920px",
					height: "300px",
				}}
			></video>
			<Music></Music>
		</div>
	);
};

render(<App />);
