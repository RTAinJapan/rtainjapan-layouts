// Packages
import React from 'react';
import styled, {css} from 'styled-components';

const Container = styled.div`
	display: grid;
	align-items: center;
	${({theme}) =>
		theme.index % 2 === 0 &&
		css`
			background-color: #dedede;
		`};
`;

const EmptySlot = styled.div`
	font-size: 24px;
	color: #adadad;
	width: 100%;
	text-align: center;
`;

export class Runner extends React.Component<{
	runner: string | null;
	index: number;
}> {
	render() {
		return (
			<Container theme={{index: this.props.index}}>
				{this.renderContent()}
			</Container>
		);
	}

	private readonly renderContent = () => {
		if (this.props.runner) {
			return <div>hello</div>;
		}
		return <EmptySlot>- EMPTY SLOT -</EmptySlot>;
	};
}
