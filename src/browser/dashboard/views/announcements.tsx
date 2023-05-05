import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import "modern-normalize";
import {Announcements} from "../components/announcements";
import {render} from "../../render";

const theme = createTheme();

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Announcements />
		</ThemeProvider>
	);
};

render(<App />);
