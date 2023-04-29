import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";
import styled from "styled-components";
import {Run} from "../../../../nodecg/generated";
import {
	Checklist as ChecklistType,
	CurrentRun,
	NextRun,
	Timer,
} from "../../../../nodecg/replicants";
import {BorderedBox} from "../lib/bordered-box";
import {Checkbox} from "./Checkbox";

const checklistRep = nodecg.Replicant("checklist");
const currentRunRep = nodecg.Replicant("current-run");
const nextRunRep = nodecg.Replicant("next-run");
const timerRep = nodecg.Replicant("timer");

const Container = styled(BorderedBox)`
	padding: 16px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: 1fr;
	grid-gap: 8px;
	user-select: none;
`;

const CurrentRunNameRow = styled.div`
	text-align: center;
	grid-column: 1 / 3;
`;

interface State {
	checklist: ChecklistType;
	currentRun: CurrentRun;
	nextRun: NextRun;
	setupNext: boolean;
}

export class Checklist extends React.Component {
	public state: State = {
		checklist: [],
		currentRun: null,
		nextRun: null,
		setupNext: false,
	};

	public componentDidMount() {
		checklistRep.on("change", this.checklistChangeHandler);
		currentRunRep.on("change", this.currentRunChangeHandler);
		nextRunRep.on("change", this.nextRunChangeHandler);
		timerRep.on("change", this.#timerChangeHandler);
	}

	public componentWillUnmount() {
		checklistRep.removeListener("change", this.checklistChangeHandler);
		currentRunRep.removeListener("change", this.currentRunChangeHandler);
		nextRunRep.removeListener("change", this.nextRunChangeHandler);
		timerRep.removeListener("change", this.#timerChangeHandler);
	}

	#timerChangeHandler = (newVal: Timer) => {
		const setupNext = ["Running", "Finished"].includes(newVal.timerState);
		this.setState({setupNext});
	};

	public render() {
		const targetRun =
			this.state.setupNext && this.state.nextRun
				? this.state.nextRun
				: this.state.currentRun;

		return (
			<Container>
				<CurrentRunNameRow>
					{this.state.setupNext ? "次のゲーム" : "現在のゲーム"} -{" "}
					{targetRun?.title}
				</CurrentRunNameRow>
				{this.state.checklist.map(
					(checklist) =>
						targetRun && this.makeChecklistElement(checklist, targetRun),
				)}
			</Container>
		);
	}

	private readonly checklistChangeHandler = (newVal: ChecklistType) => {
		this.setState({checklist: newVal});
	};

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		this.setState({currentRun: newVal});
	};

	private readonly nextRunChangeHandler = (newVal: NextRun) => {
		this.setState({nextRun: newVal});
	};

	private readonly makeChecklistElement = (
		checklist: ChecklistType[0],
		run: Run,
	) => {
		const complete = run.checklistStatus[checklist.pk] ?? false;

		return (
			<FormControlLabel
				key={checklist.name}
				control={
					<Checkbox runPk={run.pk} checklist={checklist} complete={complete} />
				}
				label={checklist.name}
				style={{
					margin: "0",
					borderRadius: "3px",
					border: "1px solid black",
				}}
			/>
		);
	};
}
