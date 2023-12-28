import gsap from "gsap";
import {ReactNode, createContext, useEffect, useState} from "react";
import {useReplicant} from "../../../use-replicant";

type DisplayLabel = "name" | "twitter" | "twitch" | "nico";

export const SyncDisplayContext = createContext<DisplayLabel>("name");

export const SyncDisplayProvider = ({children}: {children: ReactNode}) => {
	const [display, setDisplay] = useState<DisplayLabel>("name");

	const currentRun = useReplicant("current-run");

	const participantSocials = [
		...(currentRun?.runners.map((runner) =>
			[
				runner.twitter ? "twitter" : null,
				runner.twitch ? "twitch" : null,
				runner.nico ? "nico" : null,
			].filter((v): v is DisplayLabel => v !== null),
		) ?? []),
		...(currentRun?.commentators.map((commentator) =>
			[
				commentator?.twitter ? "twitter" : null,
				commentator?.twitch ? "twitch" : null,
				commentator?.nico ? "nico" : null,
			].filter((v): v is DisplayLabel => v !== null),
		) ?? []),
	];

	const displayTwitter = participantSocials.some((socials) =>
		socials.includes("twitter"),
	);
	const displayTwitch = participantSocials.some((socials) =>
		socials.includes("twitch"),
	);
	const displayNico = participantSocials.some((socials) =>
		socials.includes("nico"),
	);

	useEffect(() => {
		const tl = gsap.timeline({repeat: -1});
		const displays: DisplayLabel[] = [
			displayTwitter ? "twitter" : null,
			displayTwitch ? "twitch" : null,
			displayNico ? "nico" : null,
			"name",
		].filter((v): v is DisplayLabel => v !== null);
		for (const social of displays) {
			tl.call(
				(s) => {
					setDisplay(s);
				},
				[social],
				"+=31", // 表示時間の30秒と切り替え時間の1秒
			);
		}
		return () => {
			tl.kill();
		};
	}, [displayTwitter, displayTwitch, displayNico]);

	return (
		<SyncDisplayContext.Provider value={display}>
			{children}
		</SyncDisplayContext.Provider>
	);
};
