import "modern-normalize";
import ReactDOM from "react-dom";
import {withStyles} from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {useReplicant} from "../../use-replicant";

const AccordionSummary = withStyles({
	root: {
		backgroundColor: "rgba(0, 0, 0, .1)",
		borderBottom: "1px solid rgba(0, 0, 0, .125)",
	},
	expanded: {},
})(MuiAccordionSummary);

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

ReactDOM.render(<App></App>, document.getElementById("root"));
