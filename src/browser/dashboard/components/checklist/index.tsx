import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, {ChangeEvent} from "react";
import styled from "styled-components";
import {Checklist as ChecklistType, Timer} from "../../../../nodecg/replicants";
import {BorderedBox} from "../lib/bordered-box";

const checklistRep = nodecg.Replicant("checklist");
const timerRep = nodecg.Replicant("timer");

const Container = styled(BorderedBox)`
	padding: 16px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: 1fr;
	grid-gap: 8px;
	user-select: none;
`;

interface State {
	checklist: ChecklistType;
	disable: boolean;
}

export class Checklist extends React.Component {
	public state: State = {checklist: [], disable: false};

	public componentDidMount() {
		checklistRep.on("change", this.checklistChangeHandler);
		timerRep.on("change", this.#timerChangeHandler);
	}

	public componentWillUnmount() {
		checklistRep.removeListener("change", this.checklistChangeHandler);
		timerRep.removeListener("change", this.#timerChangeHandler);
	}

	#timerChangeHandler = (newVal: Timer) => {
		const disable = newVal.timerState === "Running";
		this.setState({disable});
	};

	public render() {
		return (
			<Container>
				{this.state.checklist.map((checklist) =>
					this.makeChecklistElement(checklist),
				)}
			</Container>
		);
	}

	private readonly checklistChangeHandler = (newVal: ChecklistType) => {
		this.setState({checklist: newVal});
	};

	private readonly toggleCheckbox = (e: ChangeEvent<any>, checked: boolean) => {
		nodecg.sendMessage("toggleCheckbox", {
			name: e.target.name,
			checked,
		});
	};

	private readonly makeChecklistElement = (checklist: ChecklistType[0]) => (
		<FormControlLabel
			disabled={this.state.disable}
			key={checklist.name}
			control={<Checkbox checked={checklist.complete} name={checklist.name} />}
			label={checklist.name}
			onChange={this.toggleCheckbox}
			style={{
				margin: "0",
				borderRadius: "3px",
				border: "1px solid black",
			}}
		/>
	);
}
