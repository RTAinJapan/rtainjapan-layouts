import "modern-normalize";
import "../styles/adobe-fonts.js";

import {render} from "../../render.js";

const params = new URLSearchParams(location.search);
const layout = params.get("layout") ?? "4x3-1";

(async () => {
	const {default: App} = await import(`./game-scene/${layout}.tsx`);
	render(<App />);
})();
