import "modern-normalize";
import ReactDOM from "react-dom";
const gameRequire = require.context("./game-scene/", true, /\.tsx$/);

const params = new URLSearchParams(location.search);
const layout = params.get("layout") ?? "4x3-1";
const App = gameRequire(`./${layout}.tsx`).default;
ReactDOM.render(<App></App>, document.getElementById("root"));
