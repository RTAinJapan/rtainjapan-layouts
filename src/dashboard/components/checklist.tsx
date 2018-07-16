import React, {ChangeEvent} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import {Checklist as ChecklistSchema} from '../../types/schemas/checklist';
import {NodeCG} from '../../types/nodecg';
import FormControlLabel from '@material-ui/core/FormControlLabel';

declare const nodecg: NodeCG;
interface State {
	checklist: ChecklistSchema;
}

const checklistRep = nodecg.Replicant<ChecklistSchema>('checklist');

export class Checklist extends React.Component<{}, State> {
	private readonly toggleCheckbox = (
		event: ChangeEvent<any>,
		checked: boolean
	) => {
		nodecg.sendMessage('toggleCheckbox', {
			name: event.target.name,
			checked,
		});
	};

	constructor(props: {}) {
		super(props);

		this.state = {checklist: []};

		checklistRep.on('change', newVal => {
			this.setState({checklist: newVal});
		});
	}

	render() {
		const leftRows = Math.ceil(this.state.checklist.length / 2);
		const LeftChecklist = this.state.checklist
			.slice(0, leftRows)
			.map(checklist => this.makeChecklistElement(checklist));
		const RightChecklist = this.state.checklist
			.slice(leftRows)
			.map(checklist => this.makeChecklistElement(checklist));

		return (
			<div id="columns">
				<div>{LeftChecklist}</div>
				<div>{RightChecklist}</div>
			</div>
		);
	}

	private makeChecklistElement(checklist: ChecklistSchema[0]) {
		return (
			<FormControlLabel
				label={checklist.name}
				key={checklist.name}
				control={
					<Checkbox
						checked={checklist.complete}
						name={checklist.name}
					/>
				}
				onChange={this.toggleCheckbox}
			/>
		);
	}
}
