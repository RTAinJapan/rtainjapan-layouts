import {HTMLAttributes, useContext, useRef} from "react";
import {ThinText, TimerText} from "../../lib/text";
import {background, border, text} from "../../../styles/colors";
import {Commentator, Runner, Timer} from "../../../../../nodecg/replicants";
import iconRunner from "../../../images/icon/icon_runner.svg";
import iconCommentator from "../../../images/icon/icon_commentary.svg";
import iconTwitter from "../../../images/icon/icon_twitter.svg";
import iconTwitch from "../../../images/icon/icon_twitch.svg";
import iconYoutube from "../../../images/icon/icon_youtube.svg";
import {styled} from "@mui/material/styles";
import {
	SwitchTransition,
	Transition,
	TransitionStatus,
} from "react-transition-group";
import {SyncDisplayContext} from "../sync-display";

const textPlacement = {
	gridColumn: "1 / 2",
	gridRow: "1 / 2",
};

const FadeContainer = styled("div")<{state: TransitionStatus}>(({state}) => ({
	transition: "all 0.5s",
	opacity: ["entered"].includes(state) ? 1 : 0,
}));

const SocialText = ({icon, text}: {icon: string; text?: string}) => {
	return text ? (
		<ThinText
			style={{
				fontSize: "22px",
				lineHeight: "26px",
				display: "grid",
				gap: "5px",
				gridTemplateColumns: "24px auto",
				placeContent: "center",
				placeItems: "center",
				width: "100%",
			}}
		>
			<img src={icon} height={18} width={18}></img>
			<div
				style={{
					width: "100%",
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
				}}
			>
				{text}
			</div>
		</ThinText>
	) : null;
};

const RaceSocialContent = ({runner}: {runner?: Runner | Commentator}) => {
	const contextDisplay = useContext(SyncDisplayContext);
	const display =
		contextDisplay && runner?.[contextDisplay] ? contextDisplay : undefined;

	const fadeNodeRef = useRef(null);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "auto 1fr",
				placeContent: "start",
				alignItems: "center",
			}}
		>
			<SwitchTransition>
				<Transition nodeRef={fadeNodeRef} key={display} timeout={250}>
					{(state) => (
						<FadeContainer ref={fadeNodeRef} state={state}>
							{display === "twitter" && (
								<SocialText icon={iconTwitter} text={runner?.twitter} />
							)}
							{display === "twitch" && (
								<SocialText icon={iconTwitch} text={runner?.twitch} />
							)}
							{display === "youtube" && (
								<SocialText icon={iconYoutube} text={runner?.youtube} />
							)}
							{!display && (
								<ThinText style={{fontSize: "22px", ...textPlacement}}>
									-
								</ThinText>
							)}
						</FadeContainer>
					)}
				</Transition>
			</SwitchTransition>
		</div>
	);
};

export const SingleRowNameplate = ({
	kind,
	person,
	result,
	style,
}: {
	kind: "runners" | "commentators";
	person?: Runner | Commentator;
	result?: Timer;
	style?: HTMLAttributes<HTMLDivElement>["style"];
}) => {
	return (
		<div
			style={{
				borderRadius: "0 0 10px 10px",
				display: "grid",
				padding: "5px 9px",
				gridTemplateRows: "40px",
				gridTemplateColumns: "32px 9px 2px 10px auto 1fr auto",
				placeContent: "stretch",
				alignItems: "center",
				justifyItems: "stretch",
				background: background.name,
				...style,
			}}
		>
			<img
				src={kind === "runners" ? iconRunner : iconCommentator}
				height={32}
				width={32}
				style={{
					justifySelf: "start",
					margin: "9px 0",
					gridColumn: "1 / 2",
				}}
			></img>
			<div
				style={{
					background: border.name,
					placeSelf: "stretch",
					gridColumn: "3 / 4",
				}}
			></div>
			<ThinText
				style={{
					fontSize: "26px",
					lineHeight: "26px",
					gridColumn: "5 / 6",
					paddingRight: "10px",
				}}
			>
				{person?.name}
			</ThinText>
			<RaceSocialContent runner={person} />

			{result && (
				<TimerText
					style={{
						width: "160px",
						transition: "opacity 0.5s 0.1s",
						opacity: result && result.timerState !== "Running" ? 1 : 0,
						justifySelf: "end",
						alignSelf: "center",
						textAlign: "right",
						fontSize: "36px",
						color: result?.forfeit ? text.timerPaused : text.timerFinished,
						gridColumn: "7 / 8",
					}}
				>
					{result?.formatted}
				</TimerText>
			)}
		</div>
	);
};
