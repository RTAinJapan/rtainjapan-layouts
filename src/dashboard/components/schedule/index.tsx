// Packages
import React from 'react';
import styled from 'styled-components';
import Downshift, {GetItemPropsOptions} from 'downshift';

// MUI Core
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

// MUI Icons
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';

import {scheduleRep, currentRunRep, nextRunRep} from '../../replicants';
import {CurrentRun} from '../../../types/schemas/currentRun';
import {NextRun} from '../../../types/schemas/nextRun';

const Container = styled.div`
	margin: 24px;
	display: grid;
	gap: 16px;
`;

const SelectionControls = styled.div`
	display: grid;
	grid-template-columns: 1fr 50% 1fr;
	gap: 8px;
`;

export class Schedule extends React.Component<
	{},
	{titles: string[]; currentRun: CurrentRun; nextRun: NextRun}
> {
	constructor(props: {}) {
		super(props);
		this.state = {
			titles: [],
			currentRun: {index: 0},
			nextRun: {},
		};
		scheduleRep.on('change', newVal => {
			if (!newVal) {
				return;
			}
			const titles: string[] = [];
			newVal
				.filter(run => run.pk !== -1)
				.map(run => run.title)
				.forEach(title => {
					if (title === undefined) {
						return;
					}
					titles.push(title);
				});
			this.setState({...this.state, titles});
		});
		currentRunRep.on('change', newVal => {
			if (!newVal) {
				return;
			}
			this.setState({...this.state, currentRun: newVal});
		});
		nextRunRep.on('change', newVal => {
			this.setState({...this.state, nextRun: newVal || {}});
		});
	}

	render() {
		return (
			<Container id="schedule-container">
				<SelectionControls id="selection-controls">
					<Button variant="contained">
						<ArrowBack />前
					</Button>
					{this.renderDownshift()}
					<Button variant="contained">
						次<ArrowForward />
					</Button>
				</SelectionControls>
				<div>hoge</div>
				<div>hoge</div>
			</Container>
		);
	}

	private readonly renderDownshift = () => (
		<Downshift>
			{({
				getInputProps,
				isOpen,
				inputValue,
				highlightedIndex,
				getItemProps,
			}) => (
				<div>
					<TextField
						fullWidth={true}
						InputProps={getInputProps({
							placeholder: 'ゲーム名',
						})}
					/>
					{!isOpen ? null : (
						<Paper square>
							{this.renderSuggestion(
								inputValue,
								getItemProps,
								highlightedIndex
							)}
						</Paper>
					)}
				</div>
			)}
		</Downshift>
	);

	private readonly renderSuggestion = (
		inputValue: string | null,
		getItemProps: (options: GetItemPropsOptions<any>) => any,
		highlightedIndex: number | null
	) =>
		this.getSuggestions(inputValue).map((suggestion, index) => (
			<MenuItem
				{...getItemProps({
					item: suggestion,
				})}
				key={suggestion}
				selected={index === highlightedIndex}
				component="div"
			>
				{suggestion}
			</MenuItem>
		));

	private readonly getSuggestions = (inputValue: string | null) => {
		const suggestions: string[] = [];
		if (inputValue) {
			for (const title of this.state.titles) {
				const titleMatches = title
					.toLowerCase()
					.includes(inputValue.toLowerCase());
				if (titleMatches) {
					suggestions.push(title);
				}
				if (suggestions.length >= 5) {
					break;
				}
			}
		}
		return suggestions;
	};
}
