import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: flex-end;
`;

const Label = styled.div`
	padding-left: 15px;

	font-size: 24px;
	font-weight: 900;
`;

const Text = styled.div`
	padding-left: 30px;
	flex-grow: 1;

	font-size: ${(props: {fontSizeMultiplier: number}) =>
		props.fontSizeMultiplier * 36}px;
	font-weight: 900;
	white-space: nowrap;
	text-align: right;
`;

interface Props {
	labelIcon: string;
	hideLabel?: boolean;
	labelText: string;
	fontSizeMultiplier: number;
}
export class Name extends React.Component<Props> {
	public render() {
		return (
			<Container>
				<img src={this.props.labelIcon} />
				{this.props.hideLabel || <Label>{this.props.labelText}</Label>}
				<Text fontSizeMultiplier={this.props.fontSizeMultiplier}>
					{this.props.children}
				</Text>
			</Container>
		);
	}
}
