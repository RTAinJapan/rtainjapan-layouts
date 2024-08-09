import {ThinText, TimerText} from "../lib/text";
import {useCurrentRun, useTimer} from "../lib/hooks";
import iconTwitter from "../../images/icon/icon_twitter.svg";
import iconTwitch from "../../images/icon/icon_twitch.svg";
import iconYoutube from "../../images/icon/icon_youtube.svg";
import iconRunner from "../../images/icon/icon_runner.svg";
import iconCommentator from "../../images/icon/icon_commentary.svg";
import {CSSProperties, HTMLAttributes, useContext, useRef} from "react";
import {background, border, text} from "../../styles/colors";
import {Commentator, Runner, Timer} from "../../../../nodecg/replicants";
import {SyncDisplayContext} from "./sync-display";
import styled from "styled-components";
import {
	SwitchTransition,
	Transition,
	TransitionStatus,
} from "react-transition-group";

const textPlacement = {
	gridColumn: "1 / 2",
	gridRow: "1 / 2",
};

const FadeContainer = styled.div<{state: TransitionStatus}>`
	transition: all 0.5s;
	opacity: 0;
	opacity: ${(props) =>
		["entered", "existing"].includes(props.state) ? "1" : "0"};
`;

const SocialText = ({icon, text}: {icon: string; text?: string}) => {
	return text ? (
		<ThinText
			style={{
				...textPlacement,
				fontSize: "24px",
				display: "grid",
				gap: "5px",
				gridTemplateColumns: "24px auto",
				placeContent: "center",
				placeItems: "center",
			}}
		>
			<img src={icon} height={24} width={24}></img>
			<div>{text}</div>
		</ThinText>
	) : null;
};

const NamePlateContent = ({
	runner,
	style,
	isRaceRunner,
}: {
	runner?: Runner | Commentator;
	style?: CSSProperties;
	isRaceRunner?: boolean;
}) => {
	const contextDisplay = useContext(SyncDisplayContext);
	const display = runner?.[contextDisplay] ? contextDisplay : "name";

	const fadeNodeRef = useRef(null);

	return !isRaceRunner ? (
		<div
			style={{
				display: "grid",
				placeContent: "center",
				placeItems: "center",
				...style,
			}}
		>
			<SwitchTransition>
				<Transition ref={fadeNodeRef} key={display} timeout={500}>
					{(state) => (
						<FadeContainer state={state}>
							{display === "name" && (
								<ThinText style={{fontSize: "26px", ...textPlacement}}>
									{runner?.name}
								</ThinText>
							)}
							{display === "twitter" && (
								<SocialText icon={iconTwitter} text={runner?.twitter} />
							)}
							{display === "twitch" && (
								<SocialText icon={iconTwitch} text={runner?.twitch} />
							)}
							{display === "youtube" && (
								<SocialText icon={iconYoutube} text={runner?.youtube} />
							)}
						</FadeContainer>
					)}
				</Transition>
			</SwitchTransition>
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
				<SwitchTransition>
					<Transition ref={fadeNodeRef} key={display} timeout={500}>
						{(state) => (
							<FadeContainer state={state}>
								{display === "name" && <div></div>}
								{display === "twitter" && (
									<SocialText icon={iconTwitter} text={runner?.twitter} />
								)}
								{display === "twitch" && (
									<SocialText icon={iconTwitch} text={runner?.twitch} />
								)}
								{display === "youtube" && (
									<SocialText icon={iconYoutube} text={runner?.youtube} />
								)}
							</FadeContainer>
						)}
					</Transition>
				</SwitchTransition>
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
				runner={currentRun[kind][index] ?? undefined}
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
					runner={currentRun[kind][index[0]] ?? undefined}
				></NamePlateContent>
				<div
					style={{
						background: border.name,
						margin: "5px 0",
						placeSelf: "stretch",
					}}
				></div>
				<NamePlateContent
					runner={currentRun[kind][index[1]] ?? undefined}
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
