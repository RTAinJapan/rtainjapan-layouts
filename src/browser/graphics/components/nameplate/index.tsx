import gsap from "gsap";
import {ThinText, TimerText} from "../lib/text";
import {useCurrentRun, useTimer} from "../lib/hooks";
import iconTwitter from "../../images/icon/icon_twitter.svg";
import iconTwitch from "../../images/icon/icon_twitch.svg";
import iconNico from "../../images/icon/icon_nico.svg";
import iconRunner from "../../images/icon/icon_runner.svg";
import iconCommentator from "../../images/icon/icon_commentary.svg";
import {
	CSSProperties,
	HTMLAttributes,
	RefObject,
	forwardRef,
	useEffect,
	useRef,
} from "react";
import {background, text} from "../../styles/colors";
import {Commentator, Runner, Timer} from "../../../../nodecg/replicants";

const textPlacement = {
	gridColumn: "1 / 2",
	gridRow: "1 / 2",
};

const Social = forwardRef<HTMLDivElement, {icon: string; text?: string}>(
	({icon, text}, ref) => {
		return (
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
				<div>{text}</div>
			</ThinText>
		);
	},
);

const NAME_FADEOUT_POS = "+=30";
const SOCIAL_FADEOUT_POS = "+=15";

const NamePlateContent = ({
	person,
	style,
	race,
	isRunner,
}: {
	person?: Runner | Commentator;
	style?: CSSProperties;
	race: boolean;
	isRunner: boolean;
}) => {
	const nameRef = useRef<HTMLDivElement>(null);
	const twitterRef = useRef<HTMLDivElement>(null);
	const twitchRef = useRef<HTMLDivElement>(null);
	const nicoRef = useRef<HTMLDivElement>(null);
	const currentRun = useCurrentRun();

	useEffect(() => {
		if (!person || !currentRun) {
			return;
		}

		const personsSocialLength = [
			person.nico,
			person.twitch,
			person.twitter,
		].filter(Boolean).length;

		// No socials: no animation
		if (personsSocialLength === 0) {
			return;
		}

		const soloSocialRef = person.nico
			? nicoRef
			: person.twitch
			? twitchRef
			: twitterRef;

		const rotateOneSocial = () => {
			const timeline = gsap.timeline({repeat: -1});
			timeline.fromTo(
				nameRef.current,
				{opacity: 0},
				{opacity: 1, duration: 0.5},
			);
			timeline.to(
				nameRef.current,
				{opacity: 0, duration: 0.5},
				NAME_FADEOUT_POS,
			);
			timeline.fromTo(
				soloSocialRef.current,
				{opacity: 0},
				{opacity: 1, duration: 0.5},
			);
			timeline.to(
				soloSocialRef.current,
				{opacity: 0, duration: 0.5},
				SOCIAL_FADEOUT_POS,
			);
			return timeline;
		};

		const rotateSyncSocials = (
			syncReference: Array<Runner | Commentator | null>,
		) => {
			let showTwitter = false;
			let showTwitch = false;
			let showNico = false;
			for (const participant of syncReference) {
				if (participant?.twitter) {
					showTwitter = true;
				}
				if (participant?.twitch) {
					showTwitch = true;
				}
				if (participant?.nico) {
					showNico = true;
				}
			}

			const animationOrder: Array<RefObject<HTMLDivElement>> = [];
			animationOrder.push(nameRef);
			if (showTwitter) {
				animationOrder.push(person?.twitter ? twitterRef : nameRef);
			}
			if (showTwitch) {
				animationOrder.push(person?.twitch ? twitchRef : nameRef);
			}
			if (showNico) {
				animationOrder.push(person?.nico ? nicoRef : nameRef);
			}
			const timeline = gsap.timeline({repeat: -1});
			for (let i = 0; i < animationOrder.length; i++) {
				const element = animationOrder[i]?.current;
				const prevElement =
					animationOrder[i - 1]?.current ??
					animationOrder[animationOrder.length - 1]?.current;
				const nextElement =
					animationOrder[i + 1]?.current ?? animationOrder[0]?.current;
				if (!element || !prevElement || !nextElement) {
					continue;
				}
				if (i === 0 || prevElement !== element) {
					timeline.fromTo(element, {opacity: 0}, {opacity: 1, duration: 0.5});
				} else {
					timeline.to(element, {opacity: 1, duration: 0.5});
				}
				timeline.to(
					element,
					{opacity: nextElement === element ? 1 : 0, duration: 0.5},
					i === 0 ? NAME_FADEOUT_POS : SOCIAL_FADEOUT_POS,
				);
			}

			return timeline;
		};

		/**
		 * Runners socials on race layouts:
		 * - if only one social: statically show it.
		 * - if multiple socials: animate socials without sync.
		 */
		if (race && isRunner) {
			if (personsSocialLength === 1) {
				gsap.set(soloSocialRef.current, {opacity: 1});
				return () => {
					gsap.set(soloSocialRef.current, {opacity: 0});
				};
			} else {
				const animationOrder: Array<RefObject<HTMLDivElement>> = [];
				if (person.twitter) {
					animationOrder.push(twitterRef);
				}
				if (person.twitch) {
					animationOrder.push(twitchRef);
				}
				if (person.nico) {
					animationOrder.push(nicoRef);
				}
				const timeline = gsap.timeline({repeat: -1});
				for (const ref of animationOrder) {
					timeline.fromTo(
						ref.current,
						{opacity: 0},
						{opacity: 1, duration: 0.5},
					);
					timeline.to(
						ref.current,
						{opacity: 0, duration: 0.5},
						SOCIAL_FADEOUT_POS,
					);
				}
				return () => {
					timeline.revert();
				};
			}
		}

		/**
		 * Commentator social animation for race layout.
		 */
		if (race && !isRunner) {
			const everyoneHasOneSocial = currentRun.commentators.every(
				(c) => [c?.nico, c?.twitch, c?.twitter].filter(Boolean).length <= 1,
			);
			if (everyoneHasOneSocial) {
				const timeline = rotateOneSocial();
				return () => {
					timeline.revert();
				};
			} else {
				const timeline = rotateSyncSocials(currentRun.commentators);
				return () => {
					timeline.revert();
				};
			}
		}

		// Handle when it's not race layout
		const everyoneHasOneSocial = [
			...currentRun.runners,
			...currentRun.commentators,
		].every(
			(p) => [p?.nico, p?.twitch, p?.twitter].filter(Boolean).length <= 1,
		);
		if (everyoneHasOneSocial) {
			const timeline = rotateOneSocial();
			return () => {
				timeline.revert();
			};
		} else {
			const timeline = rotateSyncSocials([
				...currentRun.runners,
				...currentRun.commentators,
			]);
			return () => {
				timeline.revert();
			};
		}
	}, [person, race, isRunner, currentRun]);

	if (isRunner && race) {
		return (
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
					{person?.name}
				</ThinText>
				<div
					style={{
						display: "grid",
						placeContent: "start",
						placeItems: "start",
						marginLeft: "20px",
						...style,
					}}
				>
					<Social ref={twitterRef} icon={iconTwitter} text={person?.twitter} />
					<Social ref={twitchRef} icon={iconTwitch} text={person?.twitch} />
					<Social ref={nicoRef} icon={iconNico} text={person?.nico} />
				</div>
			</div>
		);
	}

	return (
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
				{person?.name}
			</ThinText>
			<Social ref={twitterRef} icon={iconTwitter} text={person?.twitter} />
			<Social ref={twitchRef} icon={iconTwitch} text={person?.twitch} />
			<Social ref={nicoRef} icon={iconNico} text={person?.nico} />
		</div>
	);
};

export const NamePlate = ({
	kind,
	index = 0,
	cutTop,
	style,
	race,
}: {
	kind: "runners" | "commentators";
	index?: number | [number, number];
	cutTop?: boolean;
	style?: HTMLAttributes<HTMLDivElement>["style"];
	race: boolean;
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
				person={currentRun[kind][index] ?? undefined}
				style={{gridRow: "1 / 2", gridColumn: "3 / 4"}}
				race={race}
				isRunner={kind === "runners"}
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
					person={currentRun[kind][index[0]] ?? undefined}
					race={race}
					isRunner={kind === "runners"}
				></NamePlateContent>
				<div
					style={{background: "white", margin: "5px 0", placeSelf: "stretch"}}
				></div>
				<NamePlateContent
					person={currentRun[kind][index[1]] ?? undefined}
					race={race}
					isRunner={kind === "runners"}
				></NamePlateContent>
			</div>
		);

	return (
		<div
			style={{
				height: "50px",
				borderRadius: cutTop ? "0 0 7px 7px" : "7px",
				borderColor: "white",
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
					background: "white",
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
