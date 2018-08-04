import React, {ReactNode} from 'react';
import styled from 'styled-components';
import delay from 'delay';
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {currentRunRep} from '../../../lib/replicants';
import twitchIcon from '../../images/icon/twitch.png';
import nicoIcon from '../../images/icon/nico.png';
import twitterIcon from '../../images/icon/twitter.png';
import {GradientRight} from './styled';

const SOCIAL_ROTATE_INTERVAL_SECONDS = 20;
const FADE_DURATION_SECONDS = 0.5;

const Container = styled.div`
	line-height: 1;
	color: white;

	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: 1fr 3px;
	/* justify-content: space-between; */
	justify-content: stretch;
	row-gap: 6px;

	${(props: {gradientBackground?: boolean}) =>
		props.gradientBackground && GradientRight};
`;

const SubContainer = styled.div`
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	padding-left: 15px;

	display: grid;
	grid-template-columns: 36px 15px auto 30px auto 30px auto;
	justify-content: start;
	align-items: end;
`;

const SocialContainer = styled.div`
	transition: opacity ${FADE_DURATION_SECONDS}s linear;

	display: grid;
	grid-template-columns: 24px auto;
	gap: 8px;
`;

const Label = styled.div`
	font-size: 24px;
	font-weight: 900;
`;

const Name = styled.div`
	font-size: 36px;
	font-weight: 900;
`;

const SocialInfo = styled.div`
	font-size: 24px;
	font-weight: 400;
`;

const Ruler = styled.div`
	grid-column: 1 / 3;
	grid-row: 2 / 3;
	background-color: #ffff52;
`;

const ChildrenContainer = styled.div`
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: end;
	align-self: end;
	padding-right: 15px;
`;

interface Props {
	index?: number;
	gradientBackground?: boolean;
}

interface State {
	runners: CurrentRun['runners'];
	socialType?: SocialType;
	socialOpacity: number;
}

export abstract class BaseNameplate extends React.Component<Props, State> {
	private get iconSrc() {
		switch (this.state.socialType) {
			case SocialType.Nico:
				return nicoIcon;
			case SocialType.Twitch:
				return twitchIcon;
			case SocialType.Twitter:
				return twitterIcon;
			default:
				return undefined;
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
				return undefined;
			case SocialType.Nico:
				if (runner.twitter !== undefined) {
					return SocialType.Twitter;
				}
				if (runner.twitch !== undefined) {
					return SocialType.Twitch;
				}
				return undefined;
			case SocialType.Twitter:
				if (runner.twitch !== undefined) {
					return SocialType.Twitch;
				}
				if (runner.nico !== undefined) {
					return SocialType.Nico;
				}
				return undefined;
			default:
				return SocialType.Twitch;
		}
	}

	protected get socialInfo() {
		const runner = this.targetRunner;
		if (!runner) {
			return [];
		}

		const socialInfo: Array<{
			socialType: SocialType;
			info: string;
		}> = [];

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

	public state: State = {
		runners: [],
		socialOpacity: 0,
	};

	public interval?: NodeJS.Timer;

	protected abstract readonly applyCurrentRunChangeToState: (
		newVal: CurrentRun
	) => void;

	protected abstract readonly iconPath: any;

	protected abstract readonly label: string;

	public componentDidMount() {
		currentRunRep.on('change', this._currentRunChanged);
	}

	public componentWillUnmount() {
		currentRunRep.removeListener('change', this._currentRunChanged);
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
	}

	protected readonly Container = (props: {children?: ReactNode}) => (
		<Container gradientBackground={this.props.gradientBackground}>
			<SubContainer>
				<img src={this.iconPath} />
				<div />
				<Label>{this.label}</Label>
				<div />
				<Name>{this.name}</Name>
				<div />
				<SocialContainer style={{opacity: this.state.socialOpacity}}>
					<img src={this.iconSrc} />
					<SocialInfo>{this.targetRunner.name}</SocialInfo>
				</SocialContainer>
			</SubContainer>
			<ChildrenContainer>{props.children}</ChildrenContainer>
			<Ruler />
		</Container>
	);

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
		this.setState(state => ({
			socialType: this.nextSocialType || state.socialType,
		}));

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
			this.setState(state => ({
				socialType: this.nextSocialType || state.socialType,
			}));

			// Show
			this.setState({socialOpacity: 1});
		}, SOCIAL_ROTATE_INTERVAL_SECONDS * 1000);
		await delay(FADE_DURATION_SECONDS * 1000);
	};
}

const enum SocialType {
	Twitch = 'twitch',
	Nico = 'nico',
	Twitter = 'twitter',
}
