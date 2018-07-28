import React, {ReactNode} from 'react';
import delay from 'delay';
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {currentRunRep} from '../../../lib/replicants';
import {
	SubContainer,
	LabelIcon,
	Label,
	Name,
	Ruler,
	Container,
	SocialInfo,
} from './nameplate';
import styled from '../../../../node_modules/styled-components';
import twitchIcon from '../../images/icon/twitch.png';
import nicoIcon from '../../images/icon/nico.png';
import twitterIcon from '../../images/icon/twitter.png';

const enum SocialType {
	Twitch,
	Nico,
	Twitter,
}

interface Props {
	index?: number;
}

interface State {
	runners: CurrentRun['runners'];
	socialType: SocialType;
}

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

const SocialContainer = styled.div`
	height: 100%;
	position: absolute;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-end;
	opacity: 1;
	transition: opacity 0.33s linear;
`;

export abstract class BaseNameplate extends React.Component<Props, State> {
	protected abstract readonly currentRunChangeHandler: (
		newVal: CurrentRun
	) => void;
	protected abstract readonly iconPath: any;
	protected abstract readonly rootId: string;
	protected abstract readonly label: string;

	state: State = {runners: [], socialType: SocialType.Twitch};

	private readonly _currentRunChanged = (newVal: CurrentRun) => {
		this.currentRunChangeHandler(newVal);
	};

	componentDidMount() {
		currentRunRep.on('change', this._currentRunChanged);
	}

	componentWillUnmount() {
		currentRunRep.removeListener('change', this._currentRunChanged);
	}

	protected readonly Container = (props: {children?: ReactNode}) => (
		<StyledContainer id={this.rootId}>
			<SubContainer>
				<LabelIcon src={this.iconPath} />
				<Label>{this.label}</Label>
				<Name>{this.name}</Name>
				<SocialContainer>
					<img src={this.iconSrc} />
					<SocialInfo>{this.targetRunner.name}</SocialInfo>
				</SocialContainer>
			</SubContainer>
			{props.children}
			<Ruler />
		</StyledContainer>
	);

	private get iconSrc() {
		switch (this.state.socialType) {
			case SocialType.Nico:
				return nicoIcon;
			case SocialType.Twitch:
				return twitchIcon;
			case SocialType.Twitter:
				return twitterIcon;
		}
	}

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
