import gsap from "gsap";
import {ReactNode, createContext, useEffect, useState} from "react";
import {useReplicant} from "../../../use-replicant";
import {Commentator} from "../../../../nodecg/replicants";

type DisplayLabel = "name" | "twitter" | "twitch" | "nico";

export const SyncDisplayContext = createContext<DisplayLabel>("name");

export const SyncDisplayProvider = ({children}: {children: ReactNode}) => {
	const [display, setDisplay] = useState<DisplayLabel>("name");

	const currentRun = useReplicant("current-run");
	const participants = [
		...(currentRun?.runners ?? []),
		...(currentRun?.commentators.filter(
			(c): c is NonNullable<Commentator> => c !== null,
		) ?? []),
	];

	const displayTwitter = participants.some((p) => Boolean(p.twitter));
	const displayTwitch = participants.some((p) => Boolean(p.twitch));
	const displayNico = participants.some((p) => Boolean(p.nico));

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
