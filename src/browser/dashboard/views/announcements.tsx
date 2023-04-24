import ReactDOM from "react-dom";
import {createTheme, MuiThemeProvider} from "@material-ui/core";
import "modern-normalize";
import { Announcements } from '../components/announcements';

const theme = createTheme();

const App = () => {
	return (
		<MuiThemeProvider theme={theme}>
			<Announcements />
		</MuiThemeProvider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
