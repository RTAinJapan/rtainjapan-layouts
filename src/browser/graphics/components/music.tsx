import gsap, {Power2} from "gsap";
import {useEffect, useRef, useState} from "react";
import {useReplicant} from "../../use-replicant";
import musicIcon from "../images/icon/icon_music.svg";
import {setup} from "../styles/colors";
import {ThinText} from "./lib/text";
import {Divider} from "./lib/divider";

export const Music = () => {
	const playingMusic = useReplicant("playing-music");
	const isRemoveMusicSuffix =
		nodecg.bundleConfig.music?.removeMusicSuffix?.some((music) =>
			playingMusic?.includes(music),
		);
	const musicArtist = `${nodecg.bundleConfig.music?.textPrefix ?? ""} ${
		playingMusic?.split(nodecg.bundleConfig.music?.splitText ?? "\\n")[0]
	}`;
	const musicTitle = `${
		playingMusic?.split(nodecg.bundleConfig.music?.splitText ?? "\\n")[1]
	} ${!isRemoveMusicSuffix ? nodecg.bundleConfig.music?.textSuffix ?? "" : ""}`;
	const ref = useRef<HTMLDivElement>(null);
	const [shownTitle, setShownTitle] = useState("");
	const [shownArtist, setShownArtist] = useState("");

	useEffect(() => {
		const tl = gsap.timeline();
		tl.to(ref.current, {
			opacity: 0,
			duration: 1,
			ease: Power2.easeOut,
		});
		tl.call(() => {
			setShownTitle(musicTitle);
			setShownArtist(musicArtist);
			tl.to(ref.current, {
				opacity: 1,
				duration: 1,
				ease: Power2.easeOut,
			});
		});
		return () => {
			tl.revert();
		};
	}, [musicTitle, musicArtist]);

	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				height: "70px",
				paddingRight: "30px",
				right: "30px",
				top: "930px",
				background: setup.frameBg,
				borderRadius: "20px",
				display: "grid",
				gridTemplateColumns: "36px 2px auto",
				gap: "16px",
				placeItems: "center",
				placeContent: "center",
			}}
		>
			<img
				src={musicIcon}
				height={22}
				width={22}
				style={{justifySelf: "end"}}
			></img>
			<Divider></Divider>
			<div>
				<ThinText
					style={{
						fontSize: "22px",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						minWidth: "200px",
						maxWidth: "520px",
					}}
				>
					{shownTitle}
				</ThinText>
				<ThinText
					style={{
						fontSize: "22px",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						minWidth: "200px",
						maxWidth: "520px",
					}}
				>
					{shownArtist}
				</ThinText>
			</div>
		</div>
	);
};
