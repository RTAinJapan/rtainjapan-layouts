import ReactDOM from "react-dom";
import {createTheme, MuiThemeProvider} from "@material-ui/core";
import "modern-normalize";
import {Donations} from "../components/donations";

const theme = createTheme();

const App = () => {
	return (
		<MuiThemeProvider theme={theme}>
			<Donations />
		</MuiThemeProvider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
