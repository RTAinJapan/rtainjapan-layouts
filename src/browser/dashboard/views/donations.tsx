import ReactDOM from "react-dom";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import "modern-normalize";
import {Donations} from "../components/donations";

const theme = createTheme();

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Donations />
		</ThemeProvider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
