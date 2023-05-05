import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Autocomplete from "@mui/material/Autocomplete";
import {FC, useState} from "react";
import styled from "styled-components";
import {Run} from "../../../../nodecg/replicants";

const TypeaheadContainer = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
`;

interface Props {
	runs: Run[];
	disabled: boolean;
}

export const Typeahead: FC<Props> = (props: Props) => {
	const [selectedRun, setSelectedRun] = useState<{pk: number}>();

	return (
		<TypeaheadContainer>
			<Autocomplete
				options={props.runs.map((run) => ({
					pk: run.pk,
					label: run.title,
				}))}
				isOptionEqualToValue={(option, value) => {
					return option.pk === value.pk;
				}}
				renderInput={(params) => <TextField {...params} label='ゲーム名' />}
				onChange={(_, value) => {
					if (value) {
						setSelectedRun(value);
					}
				}}
			/>
			<Button
				style={{whiteSpace: "nowrap", alignSelf: "flex-end"}}
				size='small'
				onClick={async () => {
					const index = props.runs.findIndex(
						(run) => run.pk === selectedRun?.pk,
					);
					await nodecg.sendMessage("setCurrentRunByIndex", index);
				}}
				disabled={props.disabled}
			>
				スキップ
				<ChevronRight />
			</Button>
		</TypeaheadContainer>
	);
};
