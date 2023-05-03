import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Downshift, {ControllerStateAndHelpers} from "downshift";
import {FC, useState} from "react";
import styled from "styled-components";

const TypeaheadContainer = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
`;

interface Props {
	titles: Array<string | undefined>;
	disabled: boolean;
}

export const Typeahead: FC<Props> = (props: Props) => {
	const [inputText, setInputText] = useState("");

	const getSuggestions = (inputValue: string | null) => {
		const suggestions: string[] = [];
		if (inputValue) {
			for (const title of props.titles) {
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

	return (
		<TypeaheadContainer>
			<Downshift
				inputValue={inputText}
				onInputValueChange={(inputText) => {
					setInputText(inputText);
				}}
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
								{getSuggestions(inputValue).map((suggestion, index) => (
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
								))}
							</Paper>
						)}
					</div>
				)}
			</Downshift>
			<Button
				style={{whiteSpace: "nowrap", alignSelf: "flex-end"}}
				size='small'
				onClick={async () => {
					const index = props.titles.indexOf(inputText);
					await nodecg.sendMessage("setCurrentRunByIndex", index);
					setInputText("");
				}}
				disabled={props.disabled}
			>
				スキップ
				<ChevronRight />
			</Button>
		</TypeaheadContainer>
	);
};
