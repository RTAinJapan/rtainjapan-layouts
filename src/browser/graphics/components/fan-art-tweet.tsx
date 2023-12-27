import gsap from "gsap";
import iconTwitter from "../images/icon/icon_twitter.svg";
import {useEffect, useMemo, useRef, useState} from "react";
import {TweetsTemp} from "../../../nodecg/generated/tweets-temp";
import {ThinText} from "./lib/text";

export const FanArtTweet = ({
	onShow,
}: {
	onShow?: (width: number) => gsap.core.Tween | gsap.core.Timeline;
}) => {
	const [user, setUser] = useState("");
	const [text, setText] = useState("");
	const [image, setImage] = useState("");
	const tl = useMemo(() => gsap.timeline(), []);
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const listener = (tweet: TweetsTemp[number]) => {
			setUser(tweet.name);
			setText(tweet.text);
			setImage(tweet.image ?? "");
		};
		nodecg.listenFor("showFanArtTweet", listener);
		return () => {
			nodecg.unlisten("showFanArtTweet", listener);
		};
	}, [onShow, tl]);

	return (
		<div
			style={{
				display: "grid",
				rowGap: "20px",
				gridTemplateRows: "30px auto",
				gridTemplateColumns: "340px 50px 1fr",
				alignContent: "center",
				justifyContent: "stretch",
			}}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					gridRow: "1 / 2",
					gridColumn: "1 / 2",
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
					gridRow: "2 / 3",
					gridColumn: "1 / 2",
				}}
			>
				{text}
			</ThinText>
			<div
				style={{
					gridRow: "1 / 3",
					gridColumn: "2 / 3",
				}}
			></div>
			<img
				ref={imgRef}
				src={image}
				onLoad={() => {
					if (onShow) {
						tl.add(onShow(imgRef.current?.clientWidth ?? 0), "+=0.2");
					}
				}}
				style={{
					gridRow: "1 / 3",
					gridColumn: "3 / 4",
					maxWidth: "340px",
					maxHeight: "340px",
					objectFit: "cover",
				}}
			></img>
		</div>
	);
};
