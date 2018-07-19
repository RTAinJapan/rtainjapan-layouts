// Packages
import React, {ChangeEvent} from 'react';

// MUI Core
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Ours
import nodecg from '../../lib/nodecg';
import {Checklist as ChecklistSchema} from '../../types/schemas/checklist';
import {checklistRep} from '../replicants';
import {BorderedBox} from './lib/bordered-box';

const Container = BorderedBox.extend`
	padding: 16px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 7px;
`;

export class Checklist extends React.Component<
	{},
	{checklist: ChecklistSchema}
> {
	constructor(props: {}) {
		super(props);
		this.state = {checklist: []};
		checklistRep.on('change', newVal => {
			this.setState({checklist: newVal});
		});
	}

	render() {
		return (
			<Container>
				<div>{this.LeftChecklist}</div>
				<div>{this.RightChecklist}</div>
			</Container>
		);
	}

	private readonly toggleCheckbox = (
		event: ChangeEvent<any>,
		checked: boolean
	) => {
		nodecg
			.sendMessage('toggleCheckbox', {
				name: event.target.name,
				checked,
			})
			.catch(err => {
				console.error(err);
			});
	};

	private get LeftChecklist() {
		return this.state.checklist
			.slice(0, this.leftRowsCount)
			.map(checklist => this.makeChecklistElement(checklist));
	}

	private get RightChecklist() {
		return this.state.checklist
			.slice(this.leftRowsCount)
			.map(checklist => this.makeChecklistElement(checklist));
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

	private get leftRowsCount() {
		return Math.ceil(this.state.checklist.length / 2);
	}
}
