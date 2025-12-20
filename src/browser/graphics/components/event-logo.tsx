import {CSSProperties, useState, useEffect} from "react";
import rtaijLogo from "../images/logo_main.svg";
import rtaijLogoSetup from "../images/logo_setup.svg";
import {HeavyText} from "./lib/text";

export const EventLogo = (props: {style: CSSProperties; setup?: boolean}) => {
	const eventConfig = nodecg.bundleConfig.event;
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const formatDate = (date: Date): string => {
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		return `${month}/${day}`;
	};

	const formatTime = (date: Date): string => {
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${hours}:${minutes}`;
	};

	const getDateLabel = (now: Date): string => {
		if (!eventConfig) {
			return "Day 1";
		}

		const beginDate = new Date(eventConfig.beginAt);
		const endDate = new Date(eventConfig.endAt);
		const today = new Date(now);

		beginDate.setHours(0, 0, 0, 0);
		endDate.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);

		const isFinalDay = today.getTime() === endDate.getTime();
		if (isFinalDay) {
			return "Final Day";
		}

		const diffTime = today.getTime() - beginDate.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const dayNumber = diffDays + 1;

		return `Day ${dayNumber}`;
	};

	return (
		<div
			style={{
				backgroundImage: `url(${props.setup ? rtaijLogoSetup : rtaijLogo})`,
				width: "458px",
				height: "155px",
				position: "relative",
				...props.style,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "114px",
					left: "148px",
					width: "285px",
					height: "26px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<HeavyText
					style={{
						fontSize: "18px",
						transform: "rotate(0.03deg)",
					}}
				>
					{getDateLabel(currentTime)} - {formatDate(currentTime)}{" "}
					{formatTime(currentTime)}
				</HeavyText>
			</div>
		</div>
	);
};
