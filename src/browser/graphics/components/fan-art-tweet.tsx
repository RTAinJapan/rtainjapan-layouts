import gsap from "gsap";
import headerFanArt from "../images/header_fanart.svg";
import iconX from "../images/icon/icon_x.svg";
import {useEffect, useMemo, useRef, useState} from "react";
import {TweetsTemp} from "../../../nodecg/generated/tweets-temp";
import {ThinText} from "./lib/text";

export const FanArtTweet = ({
	onShow,
}: {
	onShow?: () => gsap.core.Tween | gsap.core.Timeline;
}) => {
	const [user, setUser] = useState("");
	const [text, setText] = useState("");
	const [image, setImage] = useState<string | undefined>(undefined);
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
			<ThinText
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
				}}
			>
				{text}
			</ThinText>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					alignSelf: "center",
					justifySelf: "end",
					gap: "8px",
				}}
			>
				<img ref={imgRef} src={iconX} width={18} height={18}></img>
				<ThinText
					style={{
						fontSize: "18px",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{user}
				</ThinText>
			</div>
		</div>
	);
};
