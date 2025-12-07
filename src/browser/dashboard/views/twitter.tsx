import "../styles/global";

import {createTheme, ThemeProvider} from "@mui/material/styles";
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
