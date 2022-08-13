import "modern-normalize";
import {useReplicant} from "../../use-replicant";
import ReactDOM from "react-dom";

const flashWarningRep = nodecg.Replicant("flash-warning");

const App = () => {
	const flashWarning = useReplicant("flash-warning");

	return (
		<div style={{padding: "8px"}}>
			<label>点滅注意を表示する</label>
			<input
				type='checkbox'
				checked={flashWarning ?? false}
				onChange={(e) => {
					flashWarningRep.value = e.currentTarget.checked;
				}}
			></input>
		</div>
	);
};

ReactDOM.render(<App></App>, document.getElementById("root"));
