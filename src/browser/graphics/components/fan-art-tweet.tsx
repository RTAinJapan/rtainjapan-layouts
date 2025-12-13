import gsap from "gsap";
import headerFanArt from "../images/header_fanart.svg";
import iconX from "../images/icon/icon_x.svg";
import {useEffect, useMemo, useRef, useState} from "react";
import {TweetsTemp} from "../../../nodecg/generated/tweets-temp";
import {LongText} from "./lib/text";

export const FanArtTweet = ({
	onShow,
}: {
	onShow?: () => gsap.core.Tween | gsap.core.Timeline;
}) => {
	const [user, setUser] = useState("");
	const [userId, setUserId] = useState("");
	const [text, setText] = useState("");
	const [image, setImage] = useState<string | undefined>(undefined);
	const [service, setService] = useState("X(twitter)");
	const tl = useMemo(() => gsap.timeline(), []);
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const listener = (tweet: TweetsTemp[number]) => {
			setUser(tweet.name);
			setUserId(tweet.userId);
			setText(tweet.text);
			setImage(tweet.image ?? "");
			setService(tweet.service);
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
				gridTemplateRows: "55px 25px auto 17px auto 56px",
				paddingBottom: "10px",
				alignContent: "center",
				justifyContent: "stretch",
			}}
		>
			<img src={headerFanArt} height={55} width={420}></img>
			<div></div>
			<img
				ref={imgRef}
				src={image}
				onLoad={() => {
					if (onShow) {
						tl.add(onShow(), "+=0.2");
					}
				}}
				style={{
					maxWidth: "360px",
					maxHeight: "360px",
					objectFit: "cover",
					justifySelf: "center",
				}}
			></img>
			<div></div>
			<LongText
				style={{
					fontSize: "18px",
					lineHeight: "30px",
					whiteSpace: "normal",
					wordBreak: "break-all",
					display: "-webkit-box",
					WebkitBoxOrient: "vertical",
					WebkitLineClamp: 6,
					overflow: "hidden",
					textOverflow: "ellipsis",
					letterSpacing: "-1px",
				}}
			>
				{text}
			</LongText>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					alignSelf: "center",
					justifySelf: "end",
					gap: "8px",
				}}
			>
				{service === "X(twitter)" && (
					<img ref={imgRef} src={iconX} width={18} height={18}></img>
				)}
				<LongText
					style={{
						fontSize: "18px",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{user} @{userId}
				</LongText>
			</div>
		</div>
	);
};
