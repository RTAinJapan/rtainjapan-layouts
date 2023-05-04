import "modern-normalize";
import ReactDOM from "react-dom";

const params = new URLSearchParams(location.search);
const layout = params.get("layout") ?? "4x3-1";

(async () => {
	const {default: App} = await import(`./game-scene/${layout}.tsx`);
	ReactDOM.render(<App />, document.getElementById("root"));
})();
