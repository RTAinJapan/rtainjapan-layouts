import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Downshift, {
	ControllerStateAndHelpers,
	GetItemPropsOptions,
} from "downshift";
import React from "react";
import styled from "styled-components";

const TypeaheadContainer = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
`;

interface State {
	inputText: string;
}

interface Props {
	titles: Array<string | undefined>;
}

export class Typeahead extends React.Component<Props, State> {
	public state: State = {inputText: ""};

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
								inputProps={getInputProps({
									placeholder: "ゲーム名",
								})}
							/>
							{isOpen && (
								<Paper
									style={{
										position: "absolute",
										zIndex: 1,
									}}
									square
								>
									{this.renderSuggestion(
										inputValue,
										getItemProps,
										highlightedIndex,
									)}
								</Paper>
							)}
						</div>
					)}
				</Downshift>
				<Button
					style={{whiteSpace: "nowrap", alignSelf: "flex-end"}}
					size='small'
					onClick={this.skipClicked}
				>
					スキップ
					<ChevronRight />
				</Button>
			</TypeaheadContainer>
		);
	}

	private readonly handleInputChange = (inputText: string) => {
		this.setState({inputText});
	};

	private readonly skipClicked = async () => {
		const index = this.props.titles.indexOf(this.state.inputText);
		await nodecg.sendMessage("setCurrentRunByIndex", index);
		this.setState({inputText: ""});
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
