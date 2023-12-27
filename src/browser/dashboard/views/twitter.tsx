import "../styles/global";

import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {Twitter} from "../components/twitter";
import {render} from "../../render";

const theme = createTheme();

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Twitter />
		</ThemeProvider>
	);
};

render(
	<>
		<App />
	</>,
);
