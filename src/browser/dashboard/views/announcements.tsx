import "../styles/global";

import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {Announcements} from "../components/announcements";
import {render} from "../../render";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme();

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Announcements />
		</ThemeProvider>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
