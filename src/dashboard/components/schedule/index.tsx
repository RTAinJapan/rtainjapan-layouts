// Packages
import React from 'react';
import styled from 'styled-components';
import Downshift, {
	GetItemPropsOptions,
	ControllerStateAndHelpers,
} from 'downshift';

// MUI Core
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

// MUI Icons
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ChevronRight from '@material-ui/icons/ChevronRight';

// Ours
import {scheduleRep, currentRunRep, nextRunRep} from '../../../lib/replicants';
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {NextRun} from '../../../../types/schemas/nextRun';
import {RunInfo} from './run-info';
import {BorderedBox} from '../lib/bordered-box';

const Container = BorderedBox.extend`
	height: calc(100vh - 32px);
	padding: 16px;
	display: grid;
	grid-template-rows: 40px 1fr;
	gap: 12px;
`;

const SelectionContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 50% 1fr;
	gap: 8px;
	align-items: center;
`;

const TypeaheadContainer = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	gap: 8px;
	align-items: center;
`;

const NoWrapButton = styled(Button)`
	white-space: nowrap;
`;

const RunInfoContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 0px 1fr;
	gap: 16px;
`;

const Divider = styled.div`
	border-left: 1px dashed black;
`;

const EditControls = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
`;

export class Schedule extends React.Component<
	{},
	{titles: (string | undefined)[]; currentRun: CurrentRun; nextRun: NextRun}
> {
	constructor(props: {}) {
		super(props);
		this.state = {
			titles: [],
			currentRun: {},
			nextRun: {},
		};
	}

	componentDidMount() {
		scheduleRep.on('change', newVal => {
			if (!newVal) {
				return;
			}
			const titles = newVal
				.filter(run => run.pk !== -1)
				.map(run => run.title);
			this.setState({titles});
		});
		currentRunRep.on('change', newVal => {
			if (!newVal) {
				return;
			}
			this.setState({currentRun: newVal});
		});
		nextRunRep.on('change', newVal => {
			this.setState({nextRun: newVal || {}});
		});
	}

	render() {
		return (
			<Container>
				<SelectionContainer>
					<Button variant="raised">
						<ArrowBack />前
					</Button>
					{this.renderTypeahead()}
					<Button variant="raised">
						次<ArrowForward />
					</Button>
				</SelectionContainer>
				<RunInfoContainer>
					<RunInfo run={this.state.currentRun} label="現在のゲーム" />
					<Divider />
					<RunInfo run={this.state.nextRun} label="次のゲーム" />
				</RunInfoContainer>
				<EditControls>
					<NoWrapButton variant="raised">
						編集：現在のゲーム
					</NoWrapButton>
					<NoWrapButton variant="raised">手動更新</NoWrapButton>
					<NoWrapButton variant="raised">
						編集：次のゲーム
					</NoWrapButton>
				</EditControls>
			</Container>
		);
	}

	private readonly renderTypeahead = () => (
		<TypeaheadContainer>
			<Downshift>
				{({
					getInputProps,
					isOpen,
					inputValue,
					highlightedIndex,
					getItemProps,
				}: ControllerStateAndHelpers<any>) => (
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
			<NoWrapButton variant="raised">
				スキップ<ChevronRight />
			</NoWrapButton>
		</TypeaheadContainer>
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
				if (!title) {
					continue;
				}
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
