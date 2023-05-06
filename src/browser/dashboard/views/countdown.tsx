import "../styles/global";

import CssBaseline from "@mui/material/CssBaseline";
import moment from "moment";
import {useReplicant} from "../../use-replicant";
import {render} from "../../render";

const countdownRep = nodecg.Replicant("countdown");

const App = () => {
	const countdown = useReplicant("countdown");

	return (
		<div
			style={{
				padding: "8px",
			}}
		>
			<label>開始時間</label>
			<input
				type='datetime-local'
				value={moment(countdown?.endTime).format("yyyy-MM-DDTHH:mm")}
				onChange={(e) => {
					if (countdownRep.value) {
						const time = new Date(e.target.value);
						countdownRep.value.endTime = time.getTime();
					}
				}}
				disabled={countdown?.state === "running"}
			/>
			<button
				onClick={() => {
					if (countdownRep.value) {
						countdownRep.value.state =
							countdown?.state === "running" ? "stopped" : "running";
					}
				}}
			>
				{countdown?.state === "running" ? "STOP" : "START"}
			</button>
		</div>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
