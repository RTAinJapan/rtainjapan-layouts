import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Downshift, {
	ControllerStateAndHelpers,
	GetItemPropsOptions,
} from 'downshift';
import React from 'react';
import styled from 'styled-components';
import {NoWrapButton} from '../lib/no-wrap-button';

const TypeaheadContainer = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
`;

const SkipButton = styled(NoWrapButton)`
	align-self: flex-end;
`;

const Suggestion = styled(Paper)`
	position: absolute;
	z-index: 1;
`;

interface State {
	inputText: string;
}

interface Props {
	titles: Array<string | undefined>;
}

export class Typeahead extends React.Component<Props, State> {
	public state: State = {inputText: ''};

	public render() {
		return (
			<TypeaheadContainer>
				<Downshift
					inputValue={this.state.inputText}
					onInputValueChange={this.handleInputChange}
				>
					{({
						getInputProps,
						isOpen,
						inputValue,
						highlightedIndex,
						getItemProps,
					}: ControllerStateAndHelpers<any>) => (
						<div>
							<TextField
								fullWidth
								InputProps={getInputProps({
									placeholder: 'ゲーム名',
								})}
							/>
							{isOpen && (
								<Suggestion square>
									{this.renderSuggestion(
										inputValue,
										getItemProps,
										highlightedIndex,
									)}
								</Suggestion>
							)}
						</div>
					)}
				</Downshift>
				<SkipButton size='small' onClick={this.skipClicked}>
					スキップ
					<ChevronRight />
				</SkipButton>
			</TypeaheadContainer>
		);
	}

	private readonly handleInputChange = (inputText: string) => {
		this.setState({inputText});
	};

	private readonly skipClicked = async () => {
		const index = this.props.titles.indexOf(this.state.inputText);
		await nodecg.sendMessage('setCurrentRunByIndex', index);
		this.setState({inputText: ''});
	};

	private readonly renderSuggestion = (
		inputValue: string | null,
		getItemProps: (options: GetItemPropsOptions<any>) => any,
		highlightedIndex: number | null,
	) =>
		this.getSuggestions(inputValue).map((suggestion, index) => (
			<MenuItem
				{...getItemProps({
					item: suggestion,
				})}
				key={suggestion}
				selected={index === highlightedIndex}
				component='div'
			>
				{suggestion}
			</MenuItem>
		));

	private readonly getSuggestions = (inputValue: string | null) => {
		const suggestions: string[] = [];
		if (inputValue) {
			for (const title of this.props.titles) {
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
