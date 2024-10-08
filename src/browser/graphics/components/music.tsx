import gsap, {Power2} from "gsap";
import {useEffect, useRef, useState} from "react";
import {useReplicant} from "../../use-replicant";
import musicIcon from "../images/icon/icon_music.svg";
import {border, setup} from "../styles/colors";
import {ThinText} from "./lib/text";

export const Music = () => {
	const playingMusic = useReplicant("playing-music");
	const isRemoveMusicSuffix =
		nodecg.bundleConfig.music?.removeMusicSuffix?.some((music) =>
			playingMusic?.includes(music),
		);
	const text = `${
		nodecg.bundleConfig.music?.textPrefix ?? ""
	} ${playingMusic} ${
		!isRemoveMusicSuffix ? nodecg.bundleConfig.music?.textSuffix ?? "" : ""
	}`;
	const ref = useRef<HTMLDivElement>(null);
	const [shownText, setShownText] = useState("");

	useEffect(() => {
		const tl = gsap.timeline();
		tl.to(ref.current, {
			x: ref.current?.getBoundingClientRect().width ?? 0,
			duration: 1,
			ease: Power2.easeOut,
		});
		tl.set(ref.current, {opacity: 0});
		tl.call(() => {
			setShownText(text);
			tl.set(ref.current, {opacity: 1});
			tl.fromTo(
				ref.current,
				{x: ref.current?.getBoundingClientRect().width ?? 0},
				{
					x: 0,
					duration: 1,
					ease: Power2.easeOut,
				},
				"+=0.2",
			);
		});
		return () => {
			tl.revert();
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
				borderColor: border.music,
				borderWidth: "2px 0 2px 2px",
				borderRadius: "7px 0 0 7px",
				display: "grid",
				gridTemplateColumns: "24px auto",
				gap: "10px",
				placeItems: "center",
				placeContent: "center",
				minWidth: "440px",
			}}
		>
			<img src={musicIcon} height={24} width={24}></img>
			<ThinText style={{fontSize: "22px"}}>{shownText}</ThinText>
		</div>
	);
};
