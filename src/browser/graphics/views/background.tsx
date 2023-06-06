import background from "../../images/background.png";
import {render} from "../../render";

const App = () => {
	return (
		<div
			style={{
				position: "absolute",
				width: "1920px",
				height: "1030px",
				overflow: "hidden",
				backgroundImage: `url(${background})`,
			}}
		></div>
	);
};

render(<App />);
