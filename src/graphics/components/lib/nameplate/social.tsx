import React from 'react';
import styled, {css} from 'styled-components';

interface ContainerProps {
	show: boolean;
	columnDirection: boolean | undefined;
}
const Container = styled.div`
	grid-row: 1 / 2;
	grid-column: 1 / 2;

	max-width: 100%;

	padding: 6px 0 0 30px;
	align-self: flex-end;

	display: flex;
	flex-flow: row nowrap;
	${({columnDirection}: ContainerProps) =>
		columnDirection &&
		css`
			justify-content: flex-end;
		`};
	align-items: flex-end;

	opacity: 0;
	${({show}: ContainerProps) =>
		show &&
		css`
			opacity: 1;
		`};
	transition: opacity 1s;
`;

const Text = styled.div`
	padding-left: 7.5px;

	font-size: ${(props: {fontSizeMultiplier: number}) =>
		props.fontSizeMultiplier * 24}px;
	white-space: nowrap;
`;

interface Props {
	fontSizeMultiplier: number;
	icon: string;
	show: boolean;
	columnDirection: boolean | undefined;
}
export class Social extends React.Component<Props> {
	public render() {
		return (
			<Container
				columnDirection={this.props.columnDirection}
				show={this.props.show}
			>
				<img src={this.props.icon} />
				<Text fontSizeMultiplier={this.props.fontSizeMultiplier}>
					{this.props.children}
				</Text>
			</Container>
		);
	}
}
