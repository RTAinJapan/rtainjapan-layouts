import React from 'react';
import styled, {css} from 'styled-components';
import {Ruler} from './ruler';

const Container = styled.div`
	color: white;
	white-space: nowrap;
	overflow: hidden;
	display: grid;
	grid-template-rows: auto ${(props: {thickRuler?: boolean}) =>
			props.thickRuler ? 6 : 3}px auto;
	justify-items: center;
	align-items: center;
	background: linear-gradient(
		to right,
		rgba(2, 14, 21, 0.05) 0%,
		rgba(2, 14, 21, 0.6) 45%,
		rgba(2, 14, 21, 0.6) 55%,
		rgba(2, 14, 21, 0.05) 100%
	);
`;

interface PrimaryInfoProps {
	spacy?: boolean;
	fontSize: number;
}
const PrimaryInfo = styled.div`
	font-weight: 900;
	overflow: hidden;
	font-size: ${(props: PrimaryInfoProps) => props.fontSize}px;
	${(props: PrimaryInfoProps) =>
		props.spacy &&
		css`
			padding: 9px 0;
		`};
`;

const SecondaryInfo = styled.div`
	overflow: hidden;
	font-size: ${(props: {fontSize: number}) => props.fontSize}px;
`;

const StyledRuler = Ruler.extend`
	margin: 0 30px;
`;

interface Props {
	spacy?: boolean;
	thickRuler?: boolean;
	initialPrimarySize: number;
	secondarySize: number;
	primaryInfo: string;
	secondaryInfo: string;
}

interface State {
	primarySize: number;
}

export class BaseInfo extends React.Component<Props, State> {
	state: State = {primarySize: this.props.initialPrimarySize};
	containerRef = React.createRef<HTMLDivElement>();
	primaryRef = React.createRef<HTMLDivElement>();

	render() {
		return (
			<Container
				innerRef={this.containerRef}
				thickRuler={this.props.thickRuler}
			>
				<PrimaryInfo
					fontSize={this.state.primarySize}
					spacy={this.props.spacy}
					innerRef={this.primaryRef}
				>
					{this.props.primaryInfo}
				</PrimaryInfo>
				<StyledRuler />
				<SecondaryInfo fontSize={this.props.secondarySize}>
					{this.props.secondaryInfo}
				</SecondaryInfo>
			</Container>
		);
	}

	componentDidUpdate() {
		const containerRef = this.containerRef.current;
		const primaryRef = this.primaryRef.current;
		if (!containerRef || !primaryRef) {
			return;
		}
		const containerWidth = containerRef.clientWidth;
		const primaryWidth = primaryRef.clientWidth;
		if (containerWidth - primaryWidth < 60) {
			this.setState({
				primarySize: this.state.primarySize - 1,
			});
		}
	}
}
