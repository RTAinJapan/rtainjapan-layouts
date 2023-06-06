import "../styles/global.css";

import CssBaseline from "@mui/material/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {Donations} from "../components/donations";
import {render} from "../../render";

const theme = createTheme();

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Donations />
		</ThemeProvider>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
