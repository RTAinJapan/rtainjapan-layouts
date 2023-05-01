import {Checklist} from "../../../../nodecg/replicants";
import MuiCheckbox from "@material-ui/core/Checkbox";

type Props = {
	checklist: Checklist[number];
	runPk: number;
	complete: boolean;
};

export const Checkbox = ({checklist, runPk, complete}: Props) => {
	return (
		<MuiCheckbox
			name={checklist.name}
			checked={complete}
			onChange={(_, checked) => {
				nodecg.sendMessage("toggleCheckbox", {
					runPk,
					checkPk: checklist.pk,
					checked,
				});
			}}
		/>
	);
};
