import React, {ReactNode} from 'react';
import styled, {css} from 'styled-components';
import delay from 'delay';
import {CurrentRun} from '../../../../../types/schemas/currentRun';
import {currentRunRep} from '../../../../lib/replicants';
import twitchIcon from '../../../images/icon/twitch.png';
import nicoIcon from '../../../images/icon/nico.png';
import twitterIcon from '../../../images/icon/twitter.png';
import {GradientRight} from '../styled';
import {Ruler} from '../ruler';
import {Name} from './name';
import {Social} from './social';

const SOCIAL_ROTATE_INTERVAL_SECONDS = 20;

interface ContainerProps {
	gradientBackground?: boolean;
	columnDirection?: boolean;
}
const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	line-height: 1;
	color: white;

	box-sizing: border-box;
	padding: 15px 15px 9px 15px;

	display: flex;
	flex-direction: row;
	${(props: ContainerProps) =>
		props.columnDirection &&
		css`
			flex-direction: column;
		`};
	flex-wrap: nowrap;

	${(props: ContainerProps) => props.gradientBackground && GradientRight};

	z-index: 10;
`;

const StyledRuler = Ruler.extend`
	position: absolute;
	left: 0;
	bottom: 0;
	height: 3px;
	width: 100%;
`;

const ChildrenContainer = styled.div`
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: end;
	align-self: end;
	font-weight: 900;
	font-size: ${(props: {fontSizeMultiplier: number}) =>
		props.fontSizeMultiplier * 30}px;
	padding: 0 15px;
`;

interface Props {
	index?: number;
	gradientBackground?: boolean;
	columnDirection?: boolean;
}

interface State {
	runners: CurrentRun['runners'];
	socialType?: SocialType;
	socialOpacity: number;
	hideLabel: boolean;
	fontSizeMultiplier: number;
}

export abstract class Nameplate extends React.Component<Props, State> {
	private get socialIcon() {
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
				if (runner.twitch) {
					return SocialType.Twitch;
				}
				if (runner.nico) {
					return SocialType.Nico;
				}
				if (runner.twitter) {
					return SocialType.Twitter;
				}
				return undefined;
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
				socialType: SocialType.Twitter,
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
		return targetRunner || {name: 'N/A'};
	}

	public state: State = {
		runners: [],
		socialOpacity: 0,
		fontSizeMultiplier: 1,
		hideLabel: false,
	};

	public socialRotateIntervalTimer?: NodeJS.Timer;

	protected abstract readonly applyCurrentRunChangeToState: (
		newVal: CurrentRun
	) => void;

	protected abstract readonly labelIcon: any;

	protected abstract readonly label: string;

	private container = React.createRef<HTMLDivElement>();

	private nameRef = React.createRef<Name>();

	private socialRef = React.createRef<Social>();

	public componentDidMount() {
		currentRunRep.on('change', this.currentRunChanged);
	}

	public componentWillUnmount() {
		currentRunRep.removeListener('change', this.currentRunChanged);
		if (this.socialRotateIntervalTimer !== undefined) {
			clearInterval(this.socialRotateIntervalTimer);
		}
	}

	public componentDidUpdate() {
		const containerRef = this.container.current;
		if (!containerRef) {
			return;
		}
		if (containerRef.offsetWidth >= containerRef.scrollWidth) {
			return;
		}
		if (this.state.hideLabel) {
			this.setState(state => ({
				fontSizeMultiplier: state.fontSizeMultiplier * 0.95,
			}));
		} else {
			this.setState({hideLabel: true});
		}
	}

	protected readonly Container = (props: {children?: ReactNode}) => {
		if (!this.name) {
			return <div />;
		}
		return (
			<Container
				innerRef={this.container}
				gradientBackground={this.props.gradientBackground}
				columnDirection={this.props.columnDirection}
			>
				<Name
					ref={this.nameRef}
					labelIcon={this.labelIcon}
					labelText={this.label}
					hideLabel={this.state.hideLabel}
					fontSizeMultiplier={this.state.fontSizeMultiplier}
				>
					{this.name}
				</Name>
				{this.state.socialType && (
					<Social
						ref={this.socialRef}
						fontSizeMultiplier={this.state.fontSizeMultiplier}
						icon={this.socialIcon}
					>
						{this.targetRunner[this.state.socialType || 'twitch']}
					</Social>
				)}
				<ChildrenContainer
					fontSizeMultiplier={this.state.fontSizeMultiplier}
				>
					{props.children}
				</ChildrenContainer>
				<StyledRuler />
			</Container>
		);
	};

	private readonly currentRunChanged = async (newVal: CurrentRun) => {
		const show = () => {
			this.setState({socialOpacity: 1});
		};
		const hide = () => {
			this.setState({socialOpacity: 0});
		};
		const setNextType = () => {
			this.setState(state => ({
				socialType: this.nextSocialType || state.socialType,
			}));
		};

		// Unknown race condition sometimes disables auto scaling
		await delay(0);

		// Reset font size
		this.setState({
			fontSizeMultiplier: 1,
			hideLabel: false,
		});

		if (this.state.socialOpacity !== 0) {
			hide();
		}

		this.applyCurrentRunChangeToState(newVal);

		// Don't do anything if no social info
		if (this.socialInfo.length === 0) {
			this.setState({socialType: undefined});
			return;
		}

		setNextType();
		show();

		// If only one social info don't rotate
		if (this.socialInfo.length === 1) {
			return;
		}

		// Reset interval if already exists
		if (this.socialRotateIntervalTimer !== undefined) {
			clearInterval(this.socialRotateIntervalTimer);
		}

		// Start rotate interval
		this.socialRotateIntervalTimer = setInterval(async () => {
			hide();
			setNextType();
			show();
		}, SOCIAL_ROTATE_INTERVAL_SECONDS * 1000);
	};
}

const enum SocialType {
	Twitch = 'twitch',
	Nico = 'nico',
	Twitter = 'twitter',
}
