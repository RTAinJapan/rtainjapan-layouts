import "modern-normalize";
import ReactDOM from "react-dom";

const App = () => {
	return (
		<div
			style={{
				padding: "8px",
			}}
		>
			<button
				onClick={() => {
					if (confirm("エンドロールを開始します")) {
						nodecg.sendMessage("startEndCredit");
					}
				}}
			>
				エンドロール開始
			</button>
		</div>
	);
};

ReactDOM.render(<App></App>, document.getElementById("root"));
