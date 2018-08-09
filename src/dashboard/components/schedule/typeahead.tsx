import React from 'react';
import styled from 'styled-components';
import Downshift, {
	GetItemPropsOptions,
	ControllerStateAndHelpers,
} from 'downshift';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ChevronRight from '@material-ui/icons/ChevronRight';
import {NoWrapButton} from '../lib/no-wrap-button';
import nodecg from '../../../lib/nodecg';

const TypeaheadContainer = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
`;

const SkipButton = NoWrapButton.extend`
	align-self: flex-end;
`;

const Suggestion = styled(Paper)`
	position: absolute;
	z-index: 1;
`;

interface Props {
	titles: Array<string | undefined>;
}

export class Typeahead extends React.Component<Props> {
	private readonly inputRef = React.createRef<HTMLInputElement>()

	public render() {
		return (
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
								fullWidth
								InputProps={getInputProps({
									placeholder: 'ゲーム名',
								})}
								inputRef={this.inputRef}
							/>
							{isOpen && (
								<Suggestion square>
									{this.renderSuggestion(
										inputValue,
										getItemProps,
										highlightedIndex
									)}
								</Suggestion>
							)}
						</div>
					)}
				</Downshift>
				<SkipButton variant="raised" onClick={this.skipClicked}>
					スキップ<ChevronRight />
				</SkipButton>
			</TypeaheadContainer>
		);
	}

	private readonly skipClicked = () => {
		const inputRef = this.inputRef.current
		if (!inputRef) {
			return;
		}
		const index = this.props.titles.indexOf(inputRef.value)
		nodecg.sendMessage('setCurrentRunByIndex', index)
	}

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
