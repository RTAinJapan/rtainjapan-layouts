import "modern-normalize";
import "../styles/adobe-fonts.js";

import gsap, {Power2} from "gsap";
import {BoldText, ThinText} from "../components/lib/text";
import nextGameBar from "../images/next_line.svg";
import nextGameSpacer from "../images/next_spacer.svg";
// import tagSponsor from "../images/tag_sponsor.svg";
import tagFanart from "../images/tag_fanart.svg";
import tagTweet from "../images/tag_tweet.svg";
import {useReplicant} from "../../use-replicant";
import {useCurrentRun, useSchedule} from "../components/lib/hooks";
import {Run} from "../../../nodecg/replicants";
import moment from "moment";
import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {EventLogo} from "../components/event-logo";
import {Tweet} from "../components/tweet";
import {Music} from "../components/music";
import {setup} from "../styles/colors";
import {swipeEnter, swipeExit} from "../components/lib/blur-swipe";
import {newlineString} from "../components/lib/util";
import {useFitViewport} from "../components/lib/use-fit-viewport";
import {render} from "../../render.js";

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
				top: nodecg.bundleConfig.isOnsite ? "220px" : "250px",
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

/** 画面左側の影 */
const GradientOverlay = () => {
	return (
		<div
			style={{
				position: "absolute",
				width: "1920px",
				height: "1030px",
				overflow: "hidden",
				background: `
 					linear-gradient(
 						to right,
 						rgba(10, 10, 30, 0.5),
 						rgba(10, 10, 30, 0.4) 75%,
 						rgba(10, 10, 30, 0) 100%
 					)`,
			}}
		></div>
	);
};

const TweetContainer = () => {
	const tweetTag = useRef(null);
	const fanartTag = useRef(null);
	const tweetRef = useRef(null);
	const transitionTimeline = useCallback(() => {
		const tl = gsap.timeline();
		tl.to([tweetTag.current, tweetRef.current], {
			x: -440,
			duration: 1,
			ease: Power2.easeOut,
		});
		tl.to(
			[tweetTag.current, tweetRef.current],
			{x: 0, duration: 1, ease: Power2.easeOut},
			"+=10",
		);
		return tl;
	}, []);

	return (
		<div
			style={{
				position: "absolute",
				top: "150px",
				left: "1890px",
				width: "470px",
				display: "grid",
				gridTemplateColumns: "30px 440px",
				gridTemplateRows: "81px 1fr",
			}}
		>
			<img
				ref={tweetTag}
				src={tagTweet}
				width={30}
				height={88}
				style={{
					gridRow: "1 / 2",
					gridColumn: "1 / 2",
					alignSelf: "start",
					willChange: "transform",
				}}
			></img>
			<img
				ref={fanartTag}
				src={tagFanart}
				width={30}
				height={98}
				style={{
					display: "none", // TODO: remove after adding fanart
					gridRow: "2 / 3",
					gridColumn: "1 / 2",
					alignSelf: "start",
					willChange: "transform",
				}}
			></img>
			<div
				ref={tweetRef}
				style={{
					gridRow: "1 / 3",
					gridColumn: "2 / 3",
					alignSelf: "start",
					justifySelf: "stretch",
					padding: "50px",
					borderColor: setup.frameBorder,
					borderStyle: "solid",
					borderWidth: "2px 0 2px 2px",
					borderRadius: "7px 0 0 7px",
					background: setup.frameBg,
					willChange: "transform",
				}}
			>
				<Tweet onShow={transitionTimeline}></Tweet>
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
				style={{position: "absolute", left: "30px", top: "20px"}}
			></EventLogo>
			<Upcoming></Upcoming>
			<Music></Music>
			<Sponsor></Sponsor>
			<TweetContainer></TweetContainer>
		</div>
	);
};

render(<App />);
