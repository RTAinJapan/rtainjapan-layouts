import "modern-normalize";
import "../styles/adobe-fonts.js";

import {useEffect} from "react";
import ReactDOM from "react-dom";
import {useReplicant} from "../../use-replicant";

const videoControlRep = nodecg.Replicant("video-control");

const App = () => {
	const videoControl = useReplicant("video-control");

	const initialize = (path: string | null) => {
		videoControlRep.value = path
			? {
					path,
					current: 0,
					duration: 0,
					status: "pause",
			  }
			: null;
	};

	const onPlay = () => {
		if (videoControlRep.value) {
			videoControlRep.value.status = "play";
		}
	};

	const onPause = () => {
		if (videoControlRep.value) {
			videoControlRep.value.status = "pause";
		}
	};

	const onTimeUpdate = (video: HTMLVideoElement) => {
		if (videoControlRep.value && !isNaN(video.duration)) {
			videoControlRep.value.current = video.currentTime;
			videoControlRep.value.duration = video.duration;
		}
	};

	const onEnded = (video: HTMLVideoElement) => {
		if (videoControlRep.value) {
			videoControlRep.value.status = "pause";
			videoControlRep.value.current = video.duration;
		}
	};

	const onVideoRendered = (video: HTMLVideoElement | null) => {
		if (!video) {
			return;
		}

		nodecg.listenFor("video:init", (path) => {
			initialize(path);
		});

		nodecg.listenFor("video:play", () => {
			video.play();
		});

		nodecg.listenFor("video:pause", () => {
			video.pause();
		});

		nodecg.listenFor("video:reset", () => {
			video.currentTime = 0;
		});

		nodecg.listenFor("video:stop", () => {
			video.pause();
			video.currentTime = 0;
		});

		video.onplay = onPlay;
		video.onpause = onPause;
		video.ontimeupdate = () => onTimeUpdate(video);
		video.onended = () => onEnded(video);
	};

	useEffect(() => {
		nodecg.readReplicant("video-control", (v) => {
			initialize(v?.path || null);
		});
	}, []);

	return (
		<video
			ref={onVideoRendered}
			src={videoControl?.path}
			style={{
				minWidth: "100vw",
				minHeight: "100vh",
			}}
		/>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
