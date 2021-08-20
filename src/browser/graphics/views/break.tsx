import "modern-normalize";

import gsap, {Power2} from "gsap";
import ReactDOM from "react-dom";
import {BoldText, ThinText} from "../components/lib/text";
import nextGameBar from "../images/next_line.svg";
import nextGameSpacer from "../images/next_spacer.svg";
import tagSponsor from "../images/tag_sponsor.svg";
import tagFanart from "../images/tag_fanart.svg";
import tagTweet from "../images/tag_tweet.svg";
import musicIcon from "../images/icon/icon_music.svg";
import {useReplicant} from "../../use-replicant";
import {setup} from "../styles/colors";
import {useCurrentRun, useSchedule} from "../components/lib/hooks";
import {Run} from "../../../nodecg/replicants";
import moment from "moment";
import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {EventLogo} from "../components/event-logo";
import {Tweet} from "../components/tweet";

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
		currrentRunIndex + 5,
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
				top: "250px",
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
					{nextRun.title}
				</BoldText>
				<ThinText
					style={{fontSize: "22px", gridRow: "2 / 3", gridColumn: "2 / 3"}}
				>
					{nextRun.category} - Runner:{" "}
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
								{run.title} - {run.category}
							</ThinText>
						</div>
						<Spacer></Spacer>
					</Fragment>
				);
			})}
		</div>
	);
};

const Music = () => {
	const spotify = useReplicant("spotify");
	const text = `${spotify?.currentTrack?.name} - ${spotify?.currentTrack?.artists}`;
	const ref = useRef<HTMLDivElement>(null);
	const [shownText, setShownText] = useState("");

	useEffect(() => {
		const tl = gsap.timeline();
		tl.fromTo(ref.current, {opacity: 1}, {opacity: 0, duration: 0.5});
		tl.call(() => {
			setShownText(text);
		});
		tl.fromTo(ref.current, {opacity: 0}, {opacity: 1, duration: 0.5}, "+=0.2");
		return () => {
			tl.kill();
		};
	}, [text]);

	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				height: "50px",
				padding: "0 50px",
				left: 0,
				top: "930px",
				background: setup.frameBg,
				borderStyle: "solid",
				borderColor: "white",
				borderWidth: "2px 2px 2px 0",
				borderRadius: "0 7px 7px 0",
				display: "grid",
				gridTemplateColumns: "24px auto",
				gap: "10px",
				placeItems: "center",
			}}
		>
			<img src={musicIcon} height={24} width={24}></img>
			<ThinText style={{fontSize: "22px"}}>{shownText}</ThinText>
		</div>
	);
};

const Sponsor = () => {
	const assets = useReplicant(`assets:sponsor-setup`);
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (!assets) {
			return;
		}
		const tl = gsap.timeline({repeat: -1});
		for (const asset of assets) {
			tl.set(imageRef.current, {attr: {src: asset.url}}, "+=0.2");
			tl.fromTo(
				containerRef.current,
				{x: 0},
				{x: -440, duration: 1, ease: Power2.easeOut},
				"+=0.2",
			);
			tl.fromTo(
				containerRef.current,
				{x: -440},
				{x: 0, duration: 1, ease: Power2.easeOut},
				"+=40",
			);
		}
		return () => {
			tl.kill();
		};
	}, [assets]);

	return (
		<div
			ref={containerRef}
			style={{
				position: "absolute",
				top: "620px",
				left: "1890px",
				width: "470px",
				height: "360px",
				display: "grid",
				gridTemplateColumns: "30px 440px",
				willChange: "transform",
			}}
		>
			<img src={tagSponsor} style={{alignSelf: "start"}}></img>
			<div
				style={{
					placeSelf: "stretch",
					display: "grid",
					placeContent: "center",
					placeItems: "center",
					background: "rgba(37,48,58,0.6)",
					borderWidth: "2px 0 2px 2px",
					borderStyle: "solid",
					borderColor: "white",
					borderRadius: "7px 0 0 7px",
				}}
			>
				<img ref={imageRef}></img>
			</div>
		</div>
	);
};

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
						rgba(37,48,58,0.5),
						rgba(37,48,58,0.4) 600px,
						rgba(37,48,58,0) 800px
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
				top: "50px",
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
					borderColor: "white",
					borderStyle: "solid",
					borderWidth: "2px 0 2px 2px",
					borderRadius: "7px 0 0 7px",
					background: "rgba(37, 48, 58, 0.6)",
					willChange: "transform",
				}}
			>
				<Tweet onShow={transitionTimeline}></Tweet>
			</div>
		</div>
	);
};

const App = () => {
	return (
		<div
			style={{
				position: "absolute",
				width: "1920px",
				height: "1030px",
				overflow: "hidden",
				color: "white",
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

ReactDOM.render(<App></App>, document.getElementById("root"));
