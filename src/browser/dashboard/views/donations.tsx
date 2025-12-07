import "../styles/global";

import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
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
