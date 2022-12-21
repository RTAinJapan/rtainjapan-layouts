import "modern-normalize";
import {createRef, useEffect} from "react";
import ReactDOM from "react-dom";
import {useReplicant} from "../../use-replicant";

const videoControlRep = nodecg.Replicant("video-control");

const App = () => {
	const videoControl = useReplicant("video-control");
	const videoRef = createRef<HTMLVideoElement>();

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

	nodecg.listenFor("video:init", (path) => {
		initialize(path);
	});

	nodecg.listenFor("video:play", () => {
		videoRef.current?.play();
	});

	nodecg.listenFor("video:pause", () => {
		videoRef.current?.pause();
	});

	nodecg.listenFor("video:reset", () => {
		if (videoRef.current) {
			videoRef.current.currentTime = 0;
		}
	});

	nodecg.listenFor("video:stop", () => {
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0;
		}
	});

	const onPlay = () => {
		if (videoRef.current && videoControlRep.value) {
			videoControlRep.value.status = "play";
		}
	};

	const onPause = () => {
		if (videoRef.current && videoControlRep.value) {
			videoControlRep.value.status = "pause";
		}
	};

	const onTimeUpdate = () => {
		if (
			videoRef.current &&
			videoControlRep.value &&
			!isNaN(videoRef.current.duration)
		) {
			videoControlRep.value.current = videoRef.current.currentTime;
			videoControlRep.value.duration = videoRef.current.duration;
		}
	};

	const onEnded = () => {
		if (videoRef.current && videoControlRep.value) {
			videoControlRep.value.status = "pause";
			videoControlRep.value.current = videoRef.current.duration;
		}
	};

	useEffect(() => {
		nodecg.readReplicant("video-control", (v) => {
			initialize(v?.path || null);
		});
	}, []);

	return (
		<video
			ref={videoRef}
			src={videoControl?.path}
			style={{
				minWidth: "100vw",
				minHeight: "100vh",
			}}
			onTimeUpdate={onTimeUpdate}
			onPlay={onPlay}
			onPause={onPause}
			onEnded={onEnded}
		/>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
