import {BoldText} from "./text";

/**文字列の改行文字をbrタグとして置換する */
export const displayNewLine = (titleLines: string[]) => {
	// TODO
	return titleLines.map((line) => <BoldText>{line}</BoldText>);
};
