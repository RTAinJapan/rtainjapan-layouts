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

const SOCIAL_ROTATE_INTERVAL_SECONDS = 20;
const FADE_DURATION_SECONDS = 0.5;

const enum SocialType {
	Twitch = 'twitch',
	Nico = 'nico',
	Twitter = 'twitter',
}

interface Props {
	index?: number;
}

interface State {
	runners: CurrentRun['runners'];
	socialType?: SocialType;
	socialOpacity: number;
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
	display: flex;
	flex-flow: row nowrap;
	align-items: flex-end;
	opacity: 1;
	transition: opacity ${FADE_DURATION_SECONDS}s linear;
`;

export abstract class BaseNameplate extends React.Component<Props, State> {
	protected abstract readonly applyCurrentRunChangeToState: (
		newVal: CurrentRun
	) => void;
	protected abstract readonly iconPath: any;
	protected abstract readonly rootId: string;
	protected abstract readonly label: string;

	state: State = {
		runners: [],
		socialOpacity: 0,
	};

	interval?: NodeJS.Timer;

	private readonly _currentRunChanged = async (newVal: CurrentRun) => {
		// Reset opacity
		if (this.state.socialOpacity !== 0) {
			this.setState({socialOpacity: 0});
			await delay(FADE_DURATION_SECONDS * 1000);
		}

		this.applyCurrentRunChangeToState(newVal);

		// Don't do anything if no social info
		if (this.socialInfo.length === 0) {
			return;
		}

		// Move to next social type
		this.setState({
			socialType: this.nextSocialType || this.state.socialType,
		});

		// Show
		this.setState({socialOpacity: 1});
		await delay(FADE_DURATION_SECONDS * 1000);

		// If only one social info don't rotate
		if (this.socialInfo.length === 1) {
			return;
		}

		// Rotate
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(async () => {
			// Hide
			this.setState({socialOpacity: 0});
			await delay(FADE_DURATION_SECONDS * 1000);

			// Move to next social type
			this.setState({
				socialType: this.nextSocialType || this.state.socialType,
			});

			// Show
			this.setState({socialOpacity: 1});
		}, SOCIAL_ROTATE_INTERVAL_SECONDS * 1000);
		await delay(FADE_DURATION_SECONDS * 1000);
	};

	componentDidMount() {
		currentRunRep.on('change', this._currentRunChanged);
	}

	componentWillUnmount() {
		currentRunRep.removeListener('change', this._currentRunChanged);
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
	}

	protected readonly Container = (props: {children?: ReactNode}) => (
		<StyledContainer id={this.rootId}>
			<SubContainer>
				<LabelIcon src={this.iconPath} />
				<Label>{this.label}</Label>
				<Name>{this.name}</Name>
				<SocialContainer style={{opacity: this.state.socialOpacity}}>
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

	private get nextSocialType() {
		const runner = this.targetRunner;
		switch (this.state.socialType) {
			case SocialType.Twitch:
				if (runner.nico !== undefined) {
					return SocialType.Nico;
				}
				if (runner.twitter !== undefined) {
					return SocialType.Twitter;
				}
				return;
			case SocialType.Nico:
				if (runner.twitter !== undefined) {
					return SocialType.Twitter;
				}
				if (runner.twitch !== undefined) {
					return SocialType.Twitch;
				}
				return;
			case SocialType.Twitter:
				if (runner.twitch !== undefined) {
					return SocialType.Twitch;
				}
				if (runner.nico !== undefined) {
					return SocialType.Nico;
				}
				return;
			default:
				return SocialType.Twitch;
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
