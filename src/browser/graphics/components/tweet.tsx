import gsap from "gsap";
import iconTwitter from "../images/icon/icon_twitter.svg";
import {useEffect, useMemo, useState} from "react";
import {Tweets} from "../../../nodecg/generated/tweets";
import {ThinText} from "./lib/text";

export const Tweet = ({
	onShow,
}: {
	onShow?: () => gsap.core.Tween | gsap.core.Timeline;
}) => {
	const [user, setUser] = useState("");
	const [text, setText] = useState("");
	const tl = useMemo(() => gsap.timeline(), []);

	useEffect(() => {
		const listener = (tweet: Tweets[number]) => {
			tl.call(() => {
				setUser(tweet.user.screenName);
				setText(tweet.text);
			});
			if (onShow) {
				tl.add(onShow(), "+=0.2");
			}
		};
		nodecg.listenFor("showTweet", listener);
		return () => {
			nodecg.unlisten("showTweet", listener);
		};
	}, [onShow, tl]);

	return (
		<div
			style={{
				display: "grid",
				gap: "20px",
				gridTemplateRows: "auto auto",
				alignContent: "center",
				justifyContent: "stretch",
			}}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					justifyContent: "start",
					alignItems: "end",
					justifyItems: "start",
				}}
			>
				<img
					src={iconTwitter}
					height={30}
					width={30}
					style={{margin: "0 10px"}}
				></img>
				<ThinText style={{fontSize: "20px"}}>{user}</ThinText>
			</div>
			<ThinText
				style={{
					fontSize: "18px",
					lineHeight: "30px",
					whiteSpace: "normal",
					wordBreak: "break-all",
				}}
			>
				{text}
			</ThinText>
		</div>
	);
};
