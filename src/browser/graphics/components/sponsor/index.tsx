import gsap from "gsap";
import {CSSProperties, FunctionComponent, useEffect, useRef} from "react";
import {useReplicant} from "../../../use-replicant";
import {background} from "../../styles/colors";
import {swipeEnter, swipeExit} from "../lib/blur-swipe";

export const Sponsor: FunctionComponent<{
	style?: CSSProperties;
	kind: "vertical" | "horizontal";
}> = (props) => {
	const assets = useReplicant(`assets:sponsor-${props.kind}`);
	const sponsorRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (!assets) {
			return;
		}
		const tl = gsap.timeline({repeat: -1});
		for (const asset of assets) {
			tl.set(sponsorRef.current, {attr: {src: asset.url}});
			tl.add(swipeEnter(sponsorRef), "<+=0.3");
			tl.add(swipeExit(sponsorRef), "<+=40");
		}
		return () => {
			tl.kill();
		};
	}, [assets]);

	return (
		<div
			style={{
				borderRadius: "7px",
				borderWidth: "2px",
				borderStyle: "solid",
				borderColor: "white",
				background: background.sponsor,
				display: "grid",
				placeContent: "stretch",
				...props.style,
			}}
		>
			<img
				ref={sponsorRef}
				style={{
					placeSelf: "center",
					gridRow: "1 / 2",
					gridColumn: "1 / 2",
					willChange: "-webkit-mask-image",
				}}
			></img>
		</div>
	);
};
