import "modern-normalize";
import ReactDOM from "react-dom";
import {useReplicant} from "../../use-replicant";

const cameraNameRep = nodecg.Replicant("camera-name");

const App = () => {
	const cameraName = useReplicant("camera-name");
	const cameraState = useReplicant("camera-state");

	return (
		<div
			style={{
				padding: "8px",
			}}
		>
			<label>名前</label>
			<input
				type='text'
				value={cameraName?.name || ""}
				onChange={(e) => {
					if (cameraNameRep.value) {
						cameraNameRep.value.name = e.target.value;
					}
				}}
			/>
			<button
				onClick={() => {
					nodecg.sendMessage("toggleCameraName");
				}}
				disabled={cameraState === "big"}
			>
				{cameraState === "hidden"
					? "表示する"
					: cameraState === "big"
					? "表示中(大)"
					: "隠す"}
			</button>
		</div>
	);
};

ReactDOM.render(<App></App>, document.getElementById("root"));
