import React from 'react';
import styled, {css} from '../../../../../node_modules/styled-components';

interface ContainerProps {
	opacity: number;
	fadeDuration: number;
}
const Container = styled.div`
	${(props: ContainerProps) => css`
		opacity: ${props.opacity};
		transition: opacity ${props.fadeDuration}s linear;
	`};
	max-width: 100%;

	padding-top: 6px;
	align-self: flex-end;

	display: flex;
	flex-flow: row nowrap;
	align-items: flex-end;
`;

const Text = styled.div`
	padding-left: 7.5px;
	flex-grow: 1;

	font-size: ${(props: {fontSizeMultiplier: number}) =>
		props.fontSizeMultiplier * 24}px;
	white-space: nowrap;
`;

interface Props {
	opacity: number;
	fontSizeMultiplier: number;
	icon: string;
	fadeDuration: number;
}
export class Social extends React.Component<Props> {
	public render() {
		return (
			<Container {...this.props}>
				<img src={this.props.icon} />
				<Text
					fontSizeMultiplier={this.props.fontSizeMultiplier}
				>
					{this.props.children}
				</Text>
			</Container>
		);
	}
}
