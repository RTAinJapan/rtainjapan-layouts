import React from 'react';
import styled, {css} from 'styled-components';
import {Ruler} from './ruler';
import {GradientCentre} from './styled';

interface ContainerProps {
	thickRuler?: boolean;
	gradientBackground?: boolean;
}
const Container = styled.div`
	color: white;
	white-space: nowrap;
	overflow: hidden;
	display: grid;
	grid-template-rows: auto ${(props: ContainerProps) =>
			props.thickRuler ? 6 : 3}px auto;
	justify-items: center;
	align-items: center;
	${(props: ContainerProps) => props.gradientBackground && GradientCentre};
`;

interface PrimaryInfoProps {
	spacy?: boolean;
	height?: number;
	fontSize: number;
}
const PrimaryInfo = styled.div`
	${(props: PrimaryInfoProps) =>
		props.height &&
		css`
			height: ${props.height}px;
		`} font-weight: 900;
	overflow: hidden;
	font-size: ${(props: PrimaryInfoProps) => props.fontSize}px;
	${(props: PrimaryInfoProps) =>
		props.spacy &&
		css`
			padding: 9px 0;
		`};
`;

interface SecondaryInfoProps {
	fontSize: number;
	height?: number;
}
const SecondaryInfo = styled.div`
	overflow: hidden;
	font-size: ${(props: SecondaryInfoProps) => props.fontSize}px;
	${(props: SecondaryInfoProps) =>
		props.height &&
		css`
			height: ${props.height}px;
		`};
`;

const StyledRuler = Ruler.extend`
	margin: 0 30px;
`;

interface Props {
	spacy?: boolean;
	thickRuler?: boolean;
	gradientBackground?: boolean;
	primaryHeight?: number;
	secondaryHeight?: number;
	initialPrimarySize: number;
	secondarySize: number;
}

interface State {
	primaryInfo: string;
	secondaryInfo: string;
	primarySize: number;
}

export abstract class BaseInfo extends React.Component<Props, State> {
	state: State = {
		primaryInfo: '',
		secondaryInfo: '',
		primarySize: this.props.initialPrimarySize,
	};
	containerRef = React.createRef<HTMLDivElement>();
	primaryRef = React.createRef<HTMLDivElement>();

	render() {
		return (
			<Container
				innerRef={this.containerRef}
				thickRuler={this.props.thickRuler}
				gradientBackground={this.props.gradientBackground}
			>
				<PrimaryInfo
					fontSize={this.state.primarySize}
					spacy={this.props.spacy}
					height={this.props.primaryHeight}
					innerRef={this.primaryRef}
				>
					{this.state.primaryInfo}
				</PrimaryInfo>
				<StyledRuler />
				<SecondaryInfo
					fontSize={this.props.secondarySize}
					height={this.props.secondaryHeight}
				>
					{this.state.secondaryInfo}
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
