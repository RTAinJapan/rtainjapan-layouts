import React, {ReactNode} from 'react';
import styled from 'styled-components';
import delay from 'delay';
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {currentRunRep} from '../../../lib/replicants';
import twitchIcon from '../../images/icon/twitch.png';
import nicoIcon from '../../images/icon/nico.png';
import twitterIcon from '../../images/icon/twitter.png';
import {GradientRight} from './styled';

const SOCIAL_ROTATE_INTERVAL_SECONDS = 2;
const FADE_DURATION_SECONDS = 0.5;

const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 60px;
	line-height: 1;
	color: white;

	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: 1fr 3px;
	justify-content: space-between;
	row-gap: 6px;

	${(props: {gradientBackground?: boolean}) =>
		props.gradientBackground && GradientRight};
`;

const SubContainer = styled.div`
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	padding-left: 15px;

	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: flex-end;
`;

const SocialContainer = styled.div`
	padding-left: 30px;
	transition: opacity ${FADE_DURATION_SECONDS}s linear;

	display: grid;
	grid-template-columns: 24px auto;
	gap: 8px;
`;

const Label = styled.div`
	font-size: 24px;
	font-weight: 900;
	padding-left: 15px;
`;

const Name = styled.div`
	font-size: ${(props: {fontSizeMultiplier: number}) =>
		props.fontSizeMultiplier * 36}px;
	font-weight: 900;
	white-space: nowrap;
	padding-left: 30px;
`;

const SocialInfo = styled.div`
	font-size: ${(props: {fontSizeMultiplier: number}) =>
		props.fontSizeMultiplier * 24}px;
	font-weight: 400;
	display: grid;
	align-content: center;
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
	padding: 0 15px;
`;

interface Props {
	index?: number;
	gradientBackground?: boolean;
}

interface State {
	runners: CurrentRun['runners'];
	socialType?: SocialType;
	socialOpacity: number;
	hideLabel: boolean;
	fontSizeMultiplier: number;
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
				if (runner.nico) {
					return SocialType.Nico;
				}
				if (runner.twitter) {
					return SocialType.Twitter;
				}
				return undefined;
			case SocialType.Nico:
				if (runner.twitter) {
					return SocialType.Twitter;
				}
				if (runner.twitch) {
					return SocialType.Twitch;
				}
				return undefined;
			case SocialType.Twitter:
				if (runner.twitch) {
					return SocialType.Twitch;
				}
				if (runner.nico) {
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
		const targetRunner = runners[this.props.index || 0];
		return targetRunner || {name: 'N/A', twitch: 'hogehoge'};
	}

	public state: State = {
		runners: [],
		socialOpacity: 0,
		fontSizeMultiplier: 1,
		hideLabel: false,
	};

	public interval?: NodeJS.Timer;

	protected abstract readonly applyCurrentRunChangeToState: (
		newVal: CurrentRun
	) => void;

	protected abstract readonly iconPath: any;

	protected abstract readonly label: string;

	private container = React.createRef<HTMLDivElement>();

	public componentDidMount() {
		currentRunRep.on('change', this._currentRunChanged);
	}

	public componentWillUnmount() {
		currentRunRep.removeListener('change', this._currentRunChanged);
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
	}

	public componentDidUpdate() {
		const {current} = this.container;
		if (!current) {
			return;
		}
		if (current.offsetWidth < current.scrollWidth) {
			if (this.state.hideLabel) {
				this.setState(state => ({
					fontSizeMultiplier: state.fontSizeMultiplier * 0.95,
				}));
			} else {
				this.setState({hideLabel: true});
			}
		}
	}

	protected readonly Container = (props: {children?: ReactNode}) => (
		<Container
			innerRef={this.container}
			gradientBackground={this.props.gradientBackground}
		>
			<SubContainer>
				<img src={this.iconPath} />
				{this.state.hideLabel || <Label>{this.label}</Label>}
				<Name fontSizeMultiplier={this.state.fontSizeMultiplier}>
					{(this.name || '').repeat(3)}
				</Name>
				<SocialContainer style={{opacity: this.state.socialOpacity}}>
					<img src={this.iconSrc} />
					<SocialInfo
						fontSizeMultiplier={this.state.fontSizeMultiplier}
					>
						{this.targetRunner[this.state.socialType || 'twitch']}
					</SocialInfo>
				</SocialContainer>
			</SubContainer>
			<ChildrenContainer>{props.children}</ChildrenContainer>
			<Ruler />
		</Container>
	);

	private readonly _currentRunChanged = async (newVal: CurrentRun) => {
		this.setState({
			fontSizeMultiplier: 1,
		});
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
