// Packages
import React, {ChangeEvent} from 'react';
import styled from 'styled-components';

// MUI Core
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Ours
import nodecg from '../../../lib/nodecg';
import {Checklist as ChecklistSchema} from '../../../../types/schemas/checklist';
import {checklistRep} from '../../../lib/replicants';
import {BorderedBox} from '../lib/bordered-box';

const Container = BorderedBox.extend`
	padding: 16px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: 1fr;
	grid-gap: 8px;
	user-select: none;
`;
const CheckboxLabel = styled(FormControlLabel)`
	border-radius: 3px;
	border: 1px solid black;
`;

interface State {
	checklist: ChecklistSchema;
}

export class Checklist extends React.Component<{}> {
	public state: State = {checklist: []};

	public componentDidMount() {
		checklistRep.on('change', this.checklistChangeHandler);
	}

	public componentWillUnmount() {
		checklistRep.removeListener('change', this.checklistChangeHandler);
	}

	public render() {
		return (
			<Container>
				{this.state.checklist.map(checklist =>
					this.makeChecklistElement(checklist)
				)}
			</Container>
		);
	}

	private readonly checklistChangeHandler = (newVal: ChecklistSchema) => {
		this.setState({checklist: newVal});
	};

	private readonly toggleCheckbox = (
		e: ChangeEvent<any>,
		checked: boolean
	) => {
		nodecg.sendMessage('toggleCheckbox', {
			name: e.target.name,
			checked,
		});
	};

	private readonly makeChecklistElement = (checklist: ChecklistSchema[0]) => (
		<CheckboxLabel
			key={checklist.name}
			control={
				<Checkbox checked={checklist.complete} name={checklist.name} />
			}
			label={checklist.name}
			onChange={this.toggleCheckbox}
			style={{margin: '0'}}
		/>
	);
}
