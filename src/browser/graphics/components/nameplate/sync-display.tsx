import gsap from "gsap";
import {ReactNode, createContext, useEffect, useState} from "react";
import {useReplicant} from "../../../use-replicant";

type DisplayLabel = "twitter" | "twitch" | "youtube";

export const SyncDisplayContext = createContext<DisplayLabel>("twitter");

export const SyncDisplayProvider = ({children}: {children: ReactNode}) => {
	const [display, setDisplay] = useState<DisplayLabel>("twitter");

	const currentRun = useReplicant("current-run");
	const participants = [
		...(currentRun?.runners ?? []),
		...(currentRun?.commentators ?? []),
	];

	const displayTwitter = participants.some((p) => Boolean(p?.twitter));
	const displayTwitch = participants.some((p) => Boolean(p?.twitch));
	const displayYoutube = participants.some((p) => Boolean(p?.youtube));

	useEffect(() => {
		const tl = gsap.timeline({repeat: -1});
		const displays: DisplayLabel[] = [
			displayTwitter ? "twitter" : null,
			displayTwitch ? "twitch" : null,
			displayYoutube ? "youtube" : null,
		].filter((v): v is DisplayLabel => v !== null);
		for (const social of displays) {
			tl.call(
				(s) => {
					setDisplay(s);
				},
				[social],
				"+=61", // 表示時間の60秒と切り替え時間の1秒
			);
		}
		return () => {
			tl.kill();
		};
	}, [displayTwitter, displayTwitch, displayYoutube]);

	return (
		<SyncDisplayContext.Provider value={display}>
			{children}
		</SyncDisplayContext.Provider>
	);
};
