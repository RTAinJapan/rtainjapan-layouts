import React from 'react';
import textFit from 'textfit';
import {currentRunRep} from '../../lib/replicants';
import {BaseInfo} from './lib/base-info';

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
	render() {
		return (
			<BaseInfo
				primaryInfo={this.state.title}
				secondaryInfo={this.miscText}
				spacy
				thickRuler
				initialPrimarySize={63}
				secondarySize={30}
			/>
		);
	}

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
