import React, {ReactNode} from 'react';
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {currentRunRep} from '../../../lib/replicants';
import {SocialType, SocialContainer} from './social-container';
import {
	SubContainer,
	LabelIcon,
	Label,
	Name,
	Ruler,
	Container,
} from './nameplate';

const StyledContainer = Container.extend`
	position: absolute;
	background: linear-gradient(
		to right,
		rgba(2, 14, 21, 0.6) 10%,
		rgba(2, 14, 21, 0.05) 100%
	);
	color: white;
	z-index: 1;
`;

interface Props {
	index?: number;
}

interface State {
	runners: CurrentRun['runners'];
}

export abstract class BaseNameplate extends React.Component<Props, State> {
	protected abstract readonly currentRunChangeHandler: (
		newVal: CurrentRun
	) => void;
	protected abstract readonly iconPath: any;
	protected abstract readonly rootId: string;
	protected abstract readonly label: string;

	state: State = {runners: undefined};

	componentDidMount() {
		currentRunRep.on('change', this.currentRunChangeHandler);
	}

	componentWillUnmount() {
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
	}

	protected readonly Container = (props: {children?: ReactNode}) => (
		<StyledContainer id={this.rootId}>
			<SubContainer>
				<LabelIcon src={this.iconPath} />
				<Label>{this.label}</Label>
				<Name>{this.name}</Name>
				<SocialContainer socialInfo={this.socialInfo} />
			</SubContainer>
			{props.children}
			<Ruler />
		</StyledContainer>
	);

	protected get socialInfo() {
		const runner = this.targetRunner;
		if (!runner) {
			return [];
		}

		const socialInfo: {
			socialType: SocialType;
			info: string;
		}[] = [];

		if (runner.twitch) {
			socialInfo.push({
				socialType: SocialType.Twitch,
				info: runner.twitch,
			});
		}
		if (runner.nico) {
			socialInfo.push({
				socialType: SocialType.Nico,
				info: runner.nico,
			});
		}
		if (runner.twitter) {
			socialInfo.push({
				socialType: SocialType.Twitch,
				info: runner.twitter,
			});
		}

		return socialInfo;
	}

	protected get name() {
		const runner = this.targetRunner;
		if (!runner) {
			return '';
		}
		return runner.name;
	}

	private get targetRunner() {
		const {runners} = this.state;
		if (!runners) {
			return {};
		}
		if (runners.length === 0) {
			return {};
		}
		return runners[this.props.index || 0];
	}
}
