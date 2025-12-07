import "../styles/global";

import {createTheme, ThemeProvider} from "@mui/material/styles";
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
