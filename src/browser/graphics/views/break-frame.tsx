import "../styles/common.css";

import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {Container} from "../components/lib/styled";
import frame from "../images/break-2/frame.png";
import {useReplicant} from "../../use-replicant";
import {Run, Spotify} from "../../../nodecg/replicants";
import moment from "moment";
import {RtaijOverlay} from "../components/rtaij-overlay";
import notificationIconBlue from "../images/break/notification-blue.png";
import notificationIconBrown from "../images/break/notification-brown.png";

const Root = styled(Container)`
	font-family: "MigMix 2P";
`;

const FrameContainer = styled.div`
	position: absolute;
	color: white;
	width: 660px;
	height: 380px;
	top: 316px;
	left: 1112px;
	display: grid;
	grid-template-rows: 198px 2px 180px;
`;

const NextGame = styled.div`
	display: grid;
	grid-auto-flow: row;
	gap: 20px;
	align-content: center;
	justify-content: center;
	justify-items: center;
	text-align: center;
`;

const NextGameHeader = styled.div`
	font-size: 24px;
	line-height: 24px;
	font-weight: bold;
`;

const NextGameTitle = styled.div`
	font-size: 36px;
	line-height: 36px;
	font-weight: bold;
`;

const NextGameMisc = styled.div`
	font-size: 20px;
	line-height: 20px;
`;

const Divider = styled.div`
	background-color: white;
`;

const FollowingGames = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: auto auto;
	align-content: center;
	justify-content: center;
	row-gap: 20px;
	column-gap: 10px;
	align-items: center;
`;

const FollowingGameInfo = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: flex-start;
`;
const FollowingGameTitle = styled.div`
	font-size: 24px;
	line-height: 24px;
	font-weight: bold;
`;
const FollowingGameMisc = styled.div`
	font-size: 20px;
	line-height: 20px;
`;

const NotificationIcon = styled.img`
	position: absolute;
	left: 60px;
	bottom: 15px;
`;

const NotificationText = styled.div`
	position: absolute;
	left: 225px;
	bottom: 0px;
	height: 150px;

	color: #ffffff;
	font-family: "MigMix 2P";
	font-weight: bold;
	font-size: 45px;
	line-height: 120%;

	display: grid;
	align-content: center;
`;

const FollowingRun: React.FunctionComponent<{
	timeUntil: string;
	title: string;
	misc: string;
}> = (props) => {
	return (
		<>
			<FollowingGameMisc style={{textAlign: "end"}}>
				{props.timeUntil}
			</FollowingGameMisc>
			<FollowingGameInfo>
				<FollowingGameTitle>{props.title}</FollowingGameTitle>
				<FollowingGameMisc>{props.misc}</FollowingGameMisc>
			</FollowingGameInfo>
		</>
	);
};

const CurrentTrackContainer = styled.div`
	position: absolute;
	bottom: 165px;
	right: 15px;
	height: 40px;
	background-color: rgba(27, 20, 8, 0.6);
	font-size: 22px;
	line-height: 22px;
	padding: 9px 16px;

	color: white;
	border-radius: 12px;
`;

const makeMiscString = (run: Run) => {
	const concatenatedRunners = run.runners
		.map((runner) => runner.name)
		.filter(Boolean)
		.join(", ");
	return `${run.category} | Runner: ${concatenatedRunners}`;
};

const convertDurationToString = (duration: moment.Duration) => {
	const hours = Math.floor(duration.asHours());
	const minutes = duration.minutes();
	if (hours === 0) {
		return `${minutes}分後`;
	}
	return `${hours}時間${minutes}分後`;
};

const useSpotifyCurrentTrack = () => {
	const [currentTrack, setCurrentTrack] = useState("");
	const spotifyRep = nodecg.Replicant("spotify");
	const handler = (newVal: Spotify) => {
		if (newVal.currentTrack) {
			setCurrentTrack(
				`♪ ${newVal.currentTrack.name} - ${newVal.currentTrack.artists}`,
			);
		}
	};
	useEffect(() => {
		spotifyRep.on("change", handler);
		return () => {
			spotifyRep.removeListener("change", handler);
		};
	}, [spotifyRep]);
	return currentTrack;
};

const Break: React.FunctionComponent = () => {
	const [currentRun] = useReplicant(nodecg.Replicant("current-run"));
	const [schedule] = useReplicant(nodecg.Replicant("schedule"));
	const currentTrack = useSpotifyCurrentTrack();
	const [secondNextTimeUntil, setSecondNextTimeUntil] = useState("");
	const [thirdNextTimeUntil, setThirdNextTimeUntil] = useState("");

	useEffect(() => {
		if (!currentRun || !schedule) {
			return;
		}
		const remainingTime = moment.duration(0);
		remainingTime.add(moment.duration(currentRun.runDuration));
		remainingTime.add(moment.duration(currentRun.setupDuration));
		setSecondNextTimeUntil(convertDurationToString(remainingTime));
		const secondNextRun = schedule[currentRun.index + 1];
		if (!secondNextRun) {
			setThirdNextTimeUntil("");
			return;
		}
		remainingTime.add(moment.duration(secondNextRun.runDuration));
		remainingTime.add(moment.duration(secondNextRun.setupDuration));
		setThirdNextTimeUntil(convertDurationToString(remainingTime));
	}, [currentRun, schedule]);

	if (!currentRun || !schedule) {
		return null;
	}

	const currentRunIndex = currentRun.index;
	const secondNextRun = schedule[currentRunIndex + 1];
	const thirdNextRun = schedule[currentRunIndex + 2];

	return (
		<Root backgroundImage={frame} clipBoxes={[]}>
			<FrameContainer>
				<NextGame>
					<NextGameHeader>次のゲーム</NextGameHeader>
					<NextGameTitle>{currentRun.title}</NextGameTitle>
					<NextGameMisc>{makeMiscString(currentRun)}</NextGameMisc>
				</NextGame>
				<Divider></Divider>
				<FollowingGames>
					{secondNextRun && (
						<FollowingRun
							title={secondNextRun.title}
							misc={makeMiscString(secondNextRun)}
							timeUntil={secondNextTimeUntil}
						></FollowingRun>
					)}
					{thirdNextRun && (
						<FollowingRun
							title={thirdNextRun.title}
							misc={makeMiscString(thirdNextRun)}
							timeUntil={thirdNextTimeUntil}
						></FollowingRun>
					)}
				</FollowingGames>
			</FrameContainer>
			<RtaijOverlay
				bottomHeightPx={150}
				isBreak
				TweetProps={{rowDirection: true}}
			></RtaijOverlay>
			<NotificationIcon
				src={
					nodecg.bundleConfig.colorTheme === "brown"
						? notificationIconBrown
						: notificationIconBlue
				}
			/>
			<NotificationText>準備中です、しばらくお待ち下さい</NotificationText>
			<CurrentTrackContainer>{currentTrack}</CurrentTrackContainer>
		</Root>
	);
};

ReactDOM.render(<Break></Break>, document.getElementById("root"));
