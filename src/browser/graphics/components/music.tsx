import gsap from "gsap";
import {useEffect, useRef, useState} from "react";
import {useReplicant} from "../../use-replicant";
import musicIcon from "../images/icon/icon_music.svg";
import {setup} from "../styles/colors";
import {ThinText} from "./lib/text";

export const Music = () => {
	const spotify = useReplicant("spotify");
	// prettier-ignore
	const text = `${nodecg.bundleConfig.spotify?.textPrefix ?? ""} ${spotify?.currentTrack?.name} - ${spotify?.currentTrack?.artists} ${nodecg.bundleConfig.spotify?.textSuffix ?? ""}`;
	const ref = useRef<HTMLDivElement>(null);
	const [shownText, setShownText] = useState("");

	useEffect(() => {
		const tl = gsap.timeline();
		tl.fromTo(ref.current, {opacity: 1}, {opacity: 0, duration: 0.5});
		tl.call(() => {
			setShownText(text);
		});
		tl.fromTo(ref.current, {opacity: 0}, {opacity: 1, duration: 0.5}, "+=0.2");
		return () => {
			tl.kill();
		};
	}, [text]);

	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				height: "50px",
				padding: "0 50px",
				right: 0,
				top: "50px",
				background: setup.frameBg,
				borderStyle: "solid",
				borderColor: "white",
				borderWidth: "2px 0 2px 2px",
				borderRadius: "7px 0 0 7px",
				display: "grid",
				gridTemplateColumns: "24px auto",
				gap: "10px",
				placeItems: "center",
			}}
		>
			<img src={musicIcon} height={24} width={24}></img>
			<ThinText style={{fontSize: "22px"}}>{shownText}</ThinText>
		</div>
	);
};
