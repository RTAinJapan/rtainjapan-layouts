import gsap from "gsap";
import {
	CSSProperties,
	FunctionComponent,
	useEffect,
	useRef,
	useState,
} from "react";
import {useReplicant} from "../../../use-replicant";
import {background, border} from "../../styles/colors";
import {swipeEnter, swipeExit} from "../lib/blur-swipe";
import {TweetsTemp} from "../../../../nodecg/generated/tweets-temp";
import iconTwitter from "../../images/icon/icon_twitter.svg";
import {ThinText} from "../lib/text";

export const Sponsor: FunctionComponent<{
	style?: CSSProperties;
	kind: "vertical" | "horizontal";
	twitterSmall?: boolean;
}> = (props) => {
	const assets = useReplicant(`assets:sponsor-${props.kind}`);
	const sponsorRef = useRef<HTMLImageElement>(null);
	const twitterRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLImageElement>(null);
	const [user, setUser] = useState("");
	const [text, setText] = useState("");
	const [currentSponsor, setCurrentSponsor] = useState(0);

	useEffect(() => {
		if (!assets) {
			return;
		}
		const tl = gsap.timeline();
		const initialize = () => {
			const sponsorUrl = assets[currentSponsor]?.url;
			if (!sponsorUrl) {
				return;
			}

			if (text) {
				tl.set(containerRef.current, {
					maskImage:
						"linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,0) 0%)",
				});
				tl.set(twitterRef.current, {opacity: 1});
				tl.add(swipeEnter(containerRef), "<+=0.3");
				tl.add(swipeExit(containerRef), "<+=40");
				tl.set(twitterRef.current, {opacity: 0});
				tl.call(() => {
					setUser("");
					setText("");
				});
			}

			tl.set(containerRef.current, {
				maskImage:
					"linear-gradient(to right, rgba(0,0,0,1) -20%, rgba(0,0,0,0) 0%)",
			});
			tl.set(sponsorRef.current, {opacity: 1});
			tl.set(sponsorRef.current, {attr: {src: sponsorUrl}});
			tl.add(swipeEnter(containerRef), "<+=0.3");
			tl.add(swipeExit(containerRef), "<+=40");

			tl.set(sponsorRef.current, {opacity: 0});
			tl.call(() => {
				setCurrentSponsor((currentSponsor) =>
					assets.length - 1 <= currentSponsor ? 0 : currentSponsor + 1,
				);
			});
		};

		const listener = (tweet: TweetsTemp[number]) => {
			tl.call(() => {
				setUser(tweet.name);
				setText(tweet.text);
			});
		};

		initialize();

		nodecg.listenFor("showTweet", listener);
		return () => {
			tl.revert();
			nodecg.unlisten("showTweet", listener);
		};
	}, [assets, text, currentSponsor]);

	return (
		<div
			style={{
				borderRadius: "7px",
				borderWidth: "2px",
				borderStyle: "solid",
				borderColor: border.sponsor,
				background: background.sponsor,
				display: "grid",
				placeContent: "stretch",
				...props.style,
			}}
		>
			<div
				ref={containerRef}
				style={{
					display: "grid",
					placeContent: "stretch",
					willChange: "-webkit-mask-image",
				}}
			>
				<img
					ref={sponsorRef}
					style={{
						placeSelf: "center",
						gridRow: "1 / 2",
						gridColumn: "1 / 2",
					}}
				></img>
				<div
					style={{
						placeSelf: "center",
						gridRow: "1 / 2",
						gridColumn: "1 / 2",
						opacity: 0,
						width: props.twitterSmall ? "380px" : "420px",
					}}
					ref={twitterRef}
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							justifyContent: "start",
							alignItems: "end",
							justifyItems: "start",
							marginBottom: "20px",
						}}
					>
						<img
							src={iconTwitter}
							height={24}
							width={24}
							style={{margin: "0 5px 0 15px"}}
						></img>
						<ThinText style={{fontSize: "20px"}}>{user}</ThinText>
					</div>
					<ThinText
						style={{
							fontSize: "18px",
							lineHeight: "30px",
							whiteSpace: "normal",
							wordBreak: "break-all",
						}}
					>
						{text}
					</ThinText>
				</div>
			</div>
		</div>
	);
};
