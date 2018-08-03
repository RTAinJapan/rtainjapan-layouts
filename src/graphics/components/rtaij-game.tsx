import React from 'react';
import {currentRunRep} from '../../lib/replicants';
import {BaseInfo} from './lib/base-info';

interface Props {
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

	componentDidMount() {
		currentRunRep.on('change', newVal => {
			this.setState({
				title: newVal.title || '',
				category: newVal.category || '',
				hardware: newVal.hardware || '',
			});
		});
	}

	private get miscText() {
		const {hardware} = this.state;
		return this.state.category + (hardware ? ` - ${hardware}` : '');
	}
}
