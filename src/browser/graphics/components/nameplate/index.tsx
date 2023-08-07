import gsap from "gsap";
import {ThinText, TimerText} from "../lib/text";
import {useCurrentRun, useTimer} from "../lib/hooks";
import iconTwitter from "../../images/icon/icon_twitter.svg";
import iconTwitch from "../../images/icon/icon_twitch.svg";
import iconNico from "../../images/icon/icon_nico.svg";
import iconRunner from "../../images/icon/icon_runner.svg";
import iconCommentator from "../../images/icon/icon_commentary.svg";
import {CSSProperties, HTMLAttributes, useEffect, useRef} from "react";
import {background, border, text} from "../../styles/colors";
import {filterNonNullable} from "../../../../extension/lib/array";
import {Participant, Timer} from "../../../../nodecg/replicants";

const textPlacement = {
	gridColumn: "1 / 2",
	gridRow: "1 / 2",
};

const useSocial = (icon: string, text?: string) => {
	const ref = useRef<HTMLDivElement>(null);
	if (!text) {
		return [null, null] as const;
	}
	return [
		<ThinText
			ref={ref}
			style={{
				...textPlacement,
				fontSize: "24px",
				display: "grid",
				gap: "5px",
				gridTemplateColumns: "24px auto",
				placeContent: "center",
				placeItems: "center",
				opacity: 0,
			}}
		>
			<img src={icon} height={24} width={24}></img>
			<div> {text}</div>
		</ThinText>,
		ref,
	] as const;
};

const NamePlateContent = ({
	runner,
	style,
	isRaceRunner,
}: {
	runner?: Participant;
	style?: CSSProperties;
	isRaceRunner?: boolean;
}) => {
	const nameRef = useRef<HTMLDivElement>(null);
	const emptyRef = useRef<HTMLDivElement>(null);
	const [twitter, twitterRef] = useSocial(iconTwitter, runner?.twitter);
	const [twitch, twitchRef] = useSocial(iconTwitch, runner?.twitch);
	const [nico, nicoRef] = useSocial(iconNico, runner?.nico);

	useEffect(() => {
		const refs = filterNonNullable(
			!isRaceRunner
				? [nameRef, twitterRef, twitchRef, nicoRef].map(
						(ref) => ref?.current ?? nameRef.current,
				  )
				: [emptyRef, twitterRef, twitchRef, nicoRef].map(
						(ref) => ref?.current ?? emptyRef.current,
				  ),
		);
		if (!refs[0]) {
			return;
		}

		const tl = gsap.timeline({repeat: -1});
		for (const ref of refs) {
			tl.fromTo(ref, {opacity: 0}, {opacity: 1, duration: 0.5});
			tl.to(refs, {opacity: 0, duration: 0.5}, "+=30");
		}
		return () => {
			tl.kill();
		};
	}, [nicoRef, twitterRef, twitchRef]);

	return !isRaceRunner ? (
		<div
			style={{
				display: "grid",
				placeContent: "center",
				placeItems: "center",
				...style,
			}}
		>
			<ThinText
				ref={nameRef}
				style={{fontSize: "26px", opacity: 0, ...textPlacement}}
			>
				{runner?.name}
			</ThinText>
			{twitter}
			{twitch}
			{nico}
		</div>
	) : (
		<div
			style={{
				display: "grid",
				placeSelf: "center start",
				...style,
			}}
		>
			<ThinText
				style={{fontSize: "26px", marginLeft: "10px", ...textPlacement}}
			>
				{runner?.name}
			</ThinText>
			<div
				style={{
					display: "grid",
					placeContent: "center",
					placeItems: "center",
					marginLeft: "20px",
					...style,
				}}
			>
				<div ref={emptyRef}></div>
				{twitter}
				{twitch}
				{nico}
			</div>
		</div>
	);
};

export const NamePlate = ({
	kind,
	index = 0,
	cutTop,
	style,
	race = false,
}: {
	kind: "runners" | "commentators";
	index?: number | [number, number];
	cutTop?: boolean;
	style?: HTMLAttributes<HTMLDivElement>["style"];
	race?: boolean;
}) => {
	const currentRun = useCurrentRun();
	const timer = useTimer();

	if (!currentRun || !timer) {
		return null;
	}

	const result =
		kind === "runners" && typeof index === "number" && race
			? (timer.results[index] as Timer | undefined)
			: null;

	const content =
		typeof index === "number" ? (
			<NamePlateContent
				runner={currentRun[kind][index]}
				style={{gridRow: "1 / 2", gridColumn: "3 / 4"}}
				isRaceRunner={race && kind === "runners"}
			></NamePlateContent>
		) : (
			<div
				style={{
					gridRow: "1 / 2",
					gridColumn: "3 / 4",
					placeSelf: "stretch",
					display: "grid",
					gridTemplateColumns: "1fr 2px 1fr",
					placeContent: "stretch",
					placeItems: "center",
				}}
			>
				<NamePlateContent
					runner={currentRun[kind][index[0]]}
				></NamePlateContent>
				<div
					style={{
						background: border.name,
						margin: "5px 0",
						placeSelf: "stretch",
					}}
				></div>
				<NamePlateContent
					runner={currentRun[kind][index[1]]}
				></NamePlateContent>
			</div>
		);

	return (
		<div
			style={{
				height: "50px",
				borderRadius: cutTop ? "0 0 7px 7px" : "7px",
				borderColor: border.name,
				borderStyle: "solid",
				borderWidth: cutTop ? "0 2px 2px 2px" : "2px",
				display: "grid",
				gridTemplateColumns: "46px 2px 1fr",
				placeContent: "stretch",
				placeItems: "center",
				background: background.name,
				...style,
			}}
		>
			<img
				src={kind === "runners" ? iconRunner : iconCommentator}
				height={32}
				width={32}
			></img>
			<div
				style={{
					background: border.name,
					margin: "5px 0",
					placeSelf: "stretch",
				}}
			></div>
			{content}

			<TimerText
				style={{
					transition: "opacity 0.5s 0.1s",
					opacity: result && result.timerState !== "Running" ? 1 : 0,
					justifySelf: "end",
					alignSelf: "center",
					gridRow: "1 / 2",
					gridColumn: "3 / 4",
					marginRight: "11px",
					fontSize: "38px",
					lineHeight: "38px",
					transform: "translateY(-3.8px)",
					color: result?.forfeit ? text.timerPaused : text.timerFinished,
				}}
			>
				{result?.formatted}
			</TimerText>
		</div>
	);
};
