import React from 'react';
import styled from '../../../../../node_modules/styled-components';

const Container = styled.div`
	max-width: 100%;

	padding: 6px 0 0 30px;
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
	fontSizeMultiplier: number;
	icon: string;
}
export class Social extends React.Component<Props> {
	public render() {
		return (
			<Container>
				<img style={{zIndex: 10}} src={this.props.icon} />
				<Text fontSizeMultiplier={this.props.fontSizeMultiplier}>
					{this.props.children}
				</Text>
			</Container>
		);
	}
}
