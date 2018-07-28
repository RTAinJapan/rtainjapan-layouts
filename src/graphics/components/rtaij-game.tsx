import React from 'react';
import styled from 'styled-components';
import textFit from 'textfit';
import {currentRunRep} from '../../lib/replicants';

const Container = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-end;
	align-items: center;
	color: white;
	white-space: nowrap;
`;

const Title = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 900;
`;

const Ruler = styled.div`
	display: flex;
	width: 100%;
	background-color: #ffff52;
`;

const Misc = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

interface Props {
	titleHeight: string;
	rulerHeight?: string;
	miscHeight: string;
}

interface State {
	title: string;
	category: string;
	hardware: string;
}

export class RtaijGame extends React.Component<Props, State> {
	state = {title: '', category: '', hardware: ''};

	private readonly myRefs = {
		title: React.createRef<HTMLDivElement>(),
		misc: React.createRef<HTMLDivElement>(),
	};

	componentDidMount() {
		currentRunRep.on('change', newVal => {
			this.setState({
				title: newVal.title || '',
				category: newVal.category || '',
				hardware: newVal.hardware || '',
			});
		});
	}

	render() {
		return (
			<Container>
				<Title
					innerRef={this.myRefs.title}
					style={{height: this.props.titleHeight}}
				>
					{this.state.title}
				</Title>
				<Ruler style={{height: this.props.rulerHeight || '4px'}} />
				<Misc
					innerRef={this.myRefs.misc}
					style={{height: this.props.miscHeight}}
				>
					{this.miscText}
				</Misc>
			</Container>
		);
	}

	componentDidUpdate() {
		const {title, misc} = this.myRefs;
		if (!title.current || !misc.current) {
			return;
		}
		textFit(title.current, {maxFontSize: 69.3});
		const titleContent = title.current.firstChild;
		if (!(titleContent instanceof HTMLElement)) {
			return;
		}
		const titleFontSize = titleContent.style.fontSize;
		textFit(misc.current, {
			maxFontSize:
				titleFontSize && parseInt(titleFontSize) < 48
					? parseInt(titleFontSize)
					: 48,
		});
	}

	private get miscText() {
		const {hardware} = this.state;
		return this.state.category + (hardware ? ` - ${hardware}` : '');
	}
}
