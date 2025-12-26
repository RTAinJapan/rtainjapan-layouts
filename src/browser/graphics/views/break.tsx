import "modern-normalize";

import gsap, {Power2} from "gsap";
import {BoldText, ThinText} from "../components/lib/text";
import nextGameBar from "../images/next_line.svg";
import nextGameSpacer from "../images/next_spacer.svg";
import setupShade from "../images/setup_shade.svg";
import {useCurrentRun, useSchedule} from "../components/lib/hooks";
import {Run} from "../../../nodecg/replicants";
import moment from "moment";
import {Fragment, useCallback, useRef} from "react";
import {EventLogo} from "../components/event-logo";
import {DonationMessage} from "../components/donation-message";
import {Music} from "../components/music";
import {setup} from "../styles/colors";
import {newlineString} from "../components/lib/util";
import {useFitViewport} from "../components/lib/use-fit-viewport";
import {render} from "../../render.js";
import {FanArtTweet} from "../components/fan-art-tweet.js";

const Spacer = () => <img src={nextGameSpacer} width={50} height={60}></img>;

const Upcoming = () => {
	const currentRun = useCurrentRun();
	const schedule = useSchedule();

	if (!currentRun || !schedule) {
		return null;
	}

	const currrentRunIndex = currentRun.index;

	const nextRun = currentRun;
	const upcomingRuns = schedule?.slice(
		currrentRunIndex + 1,
		currrentRunIndex + 3,
	);

	let now = moment();
	now.add(nextRun.setupDuration);
	now.add(nextRun.runDuration);
	const calcStartTime = (run: Run) => {
		const startTime = now.format("HH:mm");
		now.add(run.setupDuration);
		now.add(run.runDuration);
		return startTime;
	};

	return (
		<div
			style={{
				position: "absolute",
				left: "100px",
				top: "230px",
				display: "grid",
				gridTemplateRows: "30px 10px 100px repeat(auto-fill, 60px 30px)",
				alignContent: "start",
				justifyContent: "stretch",
				alignItems: "center",
				textShadow: "0 0 10px rgb(0,0,0)",
			}}
		>
			<BoldText style={{fontSize: "24px"}}>次のゲーム</BoldText>
			<div>{/* empty */}</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "50px 1fr",
					gridTemplateAreas: "70px 30px",
					alignItems: "center",
				}}
			>
				<img
					src={nextGameBar}
					style={{gridRow: "1 / 3", gridColumn: "1 / 2"}}
				></img>
				<BoldText
					style={{fontSize: "40px", gridRow: "1 / 2", gridColumn: "2 / 3"}}
				>
					{newlineString(nextRun.title)}
				</BoldText>
				<ThinText
					style={{fontSize: "22px", gridRow: "2 / 3", gridColumn: "2 / 3"}}
				>
					{/* カテゴリ名は文字が小さいので改行はしない */}
					{nextRun.category?.replace(/\\n/g, "")} - Runner:{" "}
					{nextRun.runners.map((r) => r.name).join(", ")}
				</ThinText>
			</div>
			<Spacer></Spacer>
			{upcomingRuns.map((run) => {
				return (
					<Fragment key={run.pk}>
						<div
							style={{
								fontSize: "22px",
								display: "grid",
								gridTemplateColumns: "100px 1fr",
							}}
						>
							<ThinText>{calcStartTime(run)} ~</ThinText>
							<ThinText>
								{/* Trackerの段階で改行文字を入れてもいいようにしておく */}
								{run.title.replace(/\\n/g, "")} -{" "}
								{run.category?.replace(/\\n/g, "")}
							</ThinText>
						</div>
						<Spacer></Spacer>
					</Fragment>
				);
			})}
		</div>
	);
};

const Camera = () => {
	return (
		<div
			style={{
				width: "528px",
				height: "328px",
				position: "absolute",
				left: "30px",
				top: "672px",
				borderStyle: "solid",
				borderWidth: "4px",
				borderRadius: "0",
				placeSelf: "stretch",
				display: "grid",
				placeContent: "stretch",
				placeItems: "stretch",
			}}
		></div>
	);
};

/*
const Sponsor = () => {
	const assets = useReplicant(`assets:sponsor-setup`);
	const imageRef = useRef<HTMLImageElement>(null);
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

			tl.set(imageRef.current, {
				maskImage:
					"linear-gradient(to right, rgba(0,0,0,0) 100%, rgba(0,0,0,1) 120%)",
			});

			tl.set(imageRef.current, {opacity: 1});

			tl.set(imageRef.current, {attr: {src: sponsorUrl}});
			tl.add(swipeEnter(imageRef), "<+=0.3");
			tl.add(swipeExit(imageRef), "<+=40");

			tl.set(imageRef.current, {opacity: 0});

			tl.call(() => {
				setCurrentSponsor((currentSponsor) =>
					assets.length - 1 <= currentSponsor ? 0 : currentSponsor + 1,
				);
			});
		};

		initialize();
		return () => {
			tl.revert();
		};
	}, [assets, currentSponsor]);

	return (
		<div
			style={{
				position: "absolute",
				top: "620px",
				right: 0,
				width: "440px",
				height: "360px",
				display: "grid",
				gridTemplateColumns: "1fr",
				willChange: "transoform",
			}}
		>
			<div
				style={{
					placeSelf: "stretch",
					display: "grid",
					placeContent: "center",
					placeItems: "center",
					background: setup.frameBg,
					borderWidth: "2px 0 2px 2px",
					borderStyle: "solid",
					borderColor: setup.frameBorder,
					borderRadius: "7px 0 0 7px",
				}}
			>
				<img ref={imageRef}></img>
			</div>
		</div>
	);
};
*/

/** 背景左側の影 */
const GradientOverlay = () => {
	return (
		<img
			src={setupShade}
			style={{
				position: "absolute",
				width: "800px",
				height: "1080px",
				overflow: "hidden",
			}}
		></img>
	);
};

const PopupContainer = () => {
	const donationRef = useRef(null);
	const fanArtRef = useRef(null);

	const transitionDonationTimeline = useCallback(() => {
		const tl = gsap.timeline();
		tl.to(donationRef.current, {
			opacity: 1,
			duration: 0.6,
			ease: Power2.easeOut,
		});
		tl.to(
			donationRef.current,
			{
				opacity: 0,
				duration: 0.6,
				ease: Power2.easeOut,
			},
			"+=20",
		);
		return tl;
	}, []);

	const transitionFanArtTimeline = useCallback(() => {
		const tl = gsap.timeline();
		tl.to(fanArtRef.current, {
			opacity: 1,
			duration: 1,
			ease: Power2.easeOut,
		});
		tl.to(
			fanArtRef.current,
			{
				opacity: 0,
				duration: 1,
				ease: Power2.easeOut,
			},
			"+=20",
		);
		return tl;
	}, []);

	return (
		<div
			style={{
				position: "absolute",
				top: "80px",
				left: "1340px",
				width: "480px",
				display: "grid",
			}}
		>
			<div
				ref={donationRef}
				style={{
					position: "absolute",
					padding: "0px 30px",
					borderColor: setup.frameBorder,
					borderRadius: "20px",
					background: setup.frameBg,
					willChange: "transform",
					opacity: 0,
				}}
			>
				<DonationMessage
					setup
					onShow={transitionDonationTimeline}
				></DonationMessage>
			</div>
			<div
				ref={fanArtRef}
				style={{
					position: "absolute",
					padding: "0px 30px",
					borderColor: setup.frameBorder,
					borderRadius: "20px",
					background: setup.frameBg,
					willChange: "transform",
					opacity: 0,
				}}
			>
				<FanArtTweet onShow={transitionFanArtTimeline} />
			</div>
		</div>
	);
};

const App = () => {
	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				width: "1920px",
				height: "1030px",
				overflow: "hidden",
				color: setup.text,
			}}
		>
			<GradientOverlay></GradientOverlay>
			<EventLogo
				style={{position: "absolute", left: "15px", top: "15px"}}
			></EventLogo>
			<Upcoming></Upcoming>
			<Camera></Camera>
			<Music></Music>
			<PopupContainer></PopupContainer>
		</div>
	);
};

render(<App />);
