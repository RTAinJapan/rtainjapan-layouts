import React from 'react';
import styled, {css} from 'styled-components';
import {Ruler} from './ruler';
import {GradientCentre} from './styled';
import { currentRunRep } from '../../../lib/replicants';

interface ContainerProps {
	thickRuler?: boolean;
	gradientBackground?: boolean;
	primaryHeight?: number;
	secondaryHeight?: number;
}
const calcContainerGridTemplateRows = (props: ContainerProps) => {
	const primaryHeight = props.primaryHeight
		? props.primaryHeight + 'px'
		: 'auto';
	const secondaryHeight = props.secondaryHeight
		? props.secondaryHeight + 'px'
		: 'auto';
	const rulerHeight = (props.thickRuler ? 6 : 3) + 'px';
	return css`
		grid-template-rows: ${primaryHeight} ${rulerHeight} ${secondaryHeight};
	`;
};
const Container = styled.div`
	color: white;
	white-space: nowrap;
	overflow: hidden;
	display: grid;
	${calcContainerGridTemplateRows};
	justify-items: center;
	align-items: center;
	${(props: ContainerProps) => props.gradientBackground && GradientCentre};
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
	font-size: 30px;
	line-height: 48px;
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
}

interface State {
	primaryInfo: string;
	secondaryInfo: string;
	primarySize: number;
}

export abstract class BaseInfo extends React.Component<Props, State> {
	public state: State = {
		primaryInfo: '',
		secondaryInfo: '',
		primarySize: 40 * 1.5,
	};

	public containerRef = React.createRef<HTMLDivElement>();

	public primaryRef = React.createRef<HTMLDivElement>();

	public render() {
		return (
			<Container
				innerRef={this.containerRef}
				thickRuler={this.props.thickRuler}
				gradientBackground={this.props.gradientBackground}
				primaryHeight={this.props.primaryHeight}
				secondaryHeight={this.props.secondaryHeight}
			>
				<PrimaryInfo
					fontSize={this.state.primarySize}
					spacy={this.props.spacy}
					innerRef={this.primaryRef}
				>
					{this.state.primaryInfo}
				</PrimaryInfo>
				<StyledRuler />
				<SecondaryInfo>{this.state.secondaryInfo}</SecondaryInfo>
			</Container>
		);
	}

	public componentDidMount() {
		currentRunRep.on('change', this._currentRunChangeHandler)
	}

	public componentWillUnmount() {
		currentRunRep.removeListener('change', this._currentRunChangeHandler)
	}

	public componentDidUpdate() {
		const containerRef = this.containerRef.current;
		const primaryRef = this.primaryRef.current;
		if (!containerRef || !primaryRef) {
			return;
		}
		const containerWidth = containerRef.clientWidth;
		const primaryWidth = primaryRef.clientWidth;
		if (containerWidth - primaryWidth < 60) {
			this.setState(state => ({
				primarySize: state.primarySize - 1,
			}));
		}
	}

	private readonly _currentRunChangeHandler = () => {
		this.setState({primarySize: 40 * 1.5})
	}
}
