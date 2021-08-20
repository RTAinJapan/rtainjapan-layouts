import gsap from "gsap";
import {CSSProperties, FunctionComponent, useEffect, useRef} from "react";
import {useReplicant} from "../../../use-replicant";
import {background} from "../../styles/colors";

const blurSwipe = {
	enter: {
		from: "linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,0) 0%)",
		to: "linear-gradient(to right, rgba(0,0,0,1) 100%, rgba(0,0,0,0) 120%)",
	},
	exit: {
		from: "linear-gradient(to right, rgba(0,0,0,0) -20%, rgba(0,0,0,1) 0%)",
		to: "linear-gradient(to right, rgba(0,0,0,0) 100%, rgba(0,0,0,1) 120%)",
	},
};

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
			tl.fromTo(
				sponsorRef.current,
				{maskImage: blurSwipe.enter.from},
				{maskImage: blurSwipe.enter.to, duration: 0.5},
				"<+=0.3",
			);
			tl.fromTo(
				sponsorRef.current,
				{maskImage: blurSwipe.exit.from},
				{maskImage: blurSwipe.exit.to, duration: 0.5},
				"<+=40",
			);
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
