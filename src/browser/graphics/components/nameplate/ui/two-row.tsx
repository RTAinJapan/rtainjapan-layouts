import {useRef} from "react";
import {ThinText, TimerText} from "../../lib/text";
import {background, border, text} from "../../../styles/colors";
import {Commentator, Runner} from "../../../../../nodecg/replicants";
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
import {useContext} from "react";
import {SyncDisplayContext} from "../sync-display";
import {NameplateProps} from "./common";

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
				...textPlacement,
				fontSize: "22px",
				display: "grid",
				gap: "5px",
				gridTemplateColumns: "24px auto",
				placeContent: "center",
				placeItems: "center",
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

const SocialContent = ({runner}: {runner?: Runner | Commentator}) => {
	const contextDisplay = useContext(SyncDisplayContext);
	const display =
		contextDisplay && runner?.[contextDisplay] ? contextDisplay : "none";

	const fadeNodeRef = useRef(null);

	return (
		<div
			style={{
				display: "grid",
				placeContent: "center",
				placeItems: "center",
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
							{display === "none" && (
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

export type TwoRowProps = {
	invert?: boolean;
};

export const TwoRowNameplate = ({
	kind,
	person,
	result,
	style,
	race = false,
	invert = false,
}: NameplateProps<TwoRowProps>) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: invert ? "column-reverse" : "column",
				...style,
			}}
		>
			<div
				style={{
					height: "80px",
					borderRadius: "20px",
					display: "grid",
					columnGap: "10px",
					padding: "8px 20px 8px 15px",
					gridTemplateColumns: "37px 2px 1fr",
					gridTemplateRows: "36px 30px",
					placeContent: "stretch",
					placeItems: "center",
					background: background.name,
				}}
			>
				<img
					src={kind === "runners" ? iconRunner : iconCommentator}
					height={32}
					width={32}
					style={{
						gridRow: "1 / 3",
						justifySelf: "start",
					}}
				></img>
				<div
					style={{
						background: border.name,
						margin: "3px 0",
						placeSelf: "stretch",
						gridRow: "1 / 3",
					}}
				></div>
				<ThinText
					style={{gridRow: "1 / 2", gridColumn: "3 / 4", fontSize: "26px"}}
				>
					{person?.name}
				</ThinText>
				<div style={{gridRow: "2 / 3", gridColumn: "3 / 4"}}>
					<SocialContent runner={person} />
				</div>
			</div>
			{race && (
				<TimerText
					style={{
						transition: "opacity 0.5s 0.1s",
						fontSize: "36px",
						height: "50px",
						lineHeight: "50px",
						opacity: result && result.timerState !== "Running" ? 1 : 0,
						color: result?.forfeit ? text.timerPaused : text.timerFinished,
						marginRight: "10px",
						alignSelf: "flex-end",
					}}
				>
					{result?.formatted}
				</TimerText>
			)}
		</div>
	);
};
