import "../styles/global.css";

import CssBaseline from "@mui/material/CssBaseline";
import styled from "@mui/material/styles/styled";
import Accordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useReplicant} from "../../use-replicant";
import {render} from "../../render";

const AccordionSummary = styled(MuiAccordionSummary)({
	"&.MuiAccordionSummary-root": {
		backgroundColor: "rgba(0, 0, 0, .1)",
		borderBottom: "1px solid rgba(0, 0, 0, .125)",
	},
	"&..Mui-expanded": {},
});

const Credit: React.FC<{
	title: string;
	names: string[];
}> = (props) => (
	<Accordion>
		<AccordionSummary
			expandIcon={<ExpandMoreIcon />}
			aria-controls='panel1a-content'
			id='panel1a-header'
		>
			<Typography>{props.title}</Typography>
		</AccordionSummary>
		<AccordionDetails>
			<ul>
				{props.names.map((name, index) => (
					<li key={index}>{name}</li>
				))}
			</ul>
		</AccordionDetails>
	</Accordion>
);

const sortNames = (names: string[]) => {
	return [...names].sort((a, b) => a.localeCompare(b, "ja"));
};

const App = () => {
	const runner = sortNames(useReplicant("runners") ?? []);
	const staff = sortNames(nodecg.bundleConfig.endCredit?.staff ?? []);
	const partners = sortNames(nodecg.bundleConfig.endCredit?.partners ?? []);
	const volunteers = sortNames(nodecg.bundleConfig.endCredit?.volunteers ?? []);
	const text = nodecg.bundleConfig.endCredit?.text ?? [];

	return (
		<div
			style={{
				display: "grid",
				gridAutoFlow: "row",
				rowGap: "16px",
				padding: "8px",
			}}
		>
			<button
				onClick={() => {
					if (confirm("エンドロールを開始します")) {
						nodecg.sendMessage("startEndCredit");
					}
				}}
			>
				エンドロール開始
			</button>
			<Credit title='Runners' names={runner} />
			<Credit title='Staff' names={staff} />
			<Credit title='Partners' names={partners} />
			<Credit title='Volunteers' names={volunteers} />
			<Credit title='Text' names={text} />
		</div>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
