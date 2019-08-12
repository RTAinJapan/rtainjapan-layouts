import delay from 'delay';
import React from 'react';
import styled, {css} from 'styled-components';
import {CurrentRun, Timer, Participant} from '../../../../../nodecg/replicants';
import nicoIcon from '../../../images/icon/nico.png';
import twitchIcon from '../../../images/icon/twitch.png';
import twitterIcon from '../../../images/icon/twitter.png';
import {Ruler} from '../ruler';
import {GradientRight} from '../styled';
import {Name} from './name';
import {Social} from './social';

const currentRunRep = nodecg.Replicant('current-run');
const timerRep = nodecg.Replicant('timer');

const SOCIAL_ROTATE_INTERVAL_SECONDS = 20;

const enum SocialType {
	Twitch = 'twitch',
	Nico = 'nico',
	Twitter = 'twitter',
}

const socialIcon = (socialType: SocialType) => {
	switch (socialType) {
		case SocialType.Nico:
			return nicoIcon;
		case SocialType.Twitch:
			return twitchIcon;
		case SocialType.Twitter:
			return twitterIcon;
		default:
			return undefined;
	}
};

const calcSocialInfo = (runner: NonNullable<Participant>) => {
	const allSocialInfo = [
		{type: SocialType.Twitch, info: runner.twitch},
		{type: SocialType.Nico, info: runner.nico},
		{type: SocialType.Twitter, info: runner.twitter},
	];
	return allSocialInfo.filter(
		(info): info is typeof allSocialInfo[0] & {info: string} =>
			typeof info.info === 'string' && info.info !== '',
	);
};

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

const StyledRuler = styled(Ruler)`
	position: absolute;
	left: 0;
	bottom: 0;
	height: 3px;
	width: 100%;
`;

const ChildrenContainer = styled.div`
	color: #ffff52;
	align-self: flex-end;
	flex-grow: 1;
	text-align: right;
	font-weight: 900;
	font-size: ${(props: {fontSizeMultiplier: number}) =>
		props.fontSizeMultiplier * 30}px;
	padding: 0 15px;
`;

const SocialContainer = styled.div`
	display: grid;
	justify-content: end;
`;

interface Props {
	index: number;
	gradientBackground?: boolean;
	columnDirection?: boolean;
	showFinishTime?: boolean;
	hideLabel?: boolean;
}

interface State {
	runner?: Participant;
	hideLabel: boolean;
	fontSizeMultiplier: number;
	showingSocialIndex: number;
	finalTime: string | undefined;
}

export abstract class Nameplate extends React.Component<Props, State> {
	public state: State = {
		fontSizeMultiplier: 1,
		hideLabel: false,
		showingSocialIndex: 0,
		finalTime: undefined,
	};

	public socialRotateIntervalTimer?: number;

	protected abstract readonly calcNewRunner: (
		newVal: CurrentRun,
	) => Participant | null;

	protected abstract readonly labelIcon: any;

	protected abstract readonly label: string;

	private readonly container = React.createRef<HTMLDivElement>();

	public render() {
		const {state} = this;
		if (!state.runner || !state.runner.name) {
			return <div />;
		}
		const socialInfo = calcSocialInfo(state.runner);
		const socialLength = socialInfo.length;
		const showingSocialIndex = state.showingSocialIndex % socialLength;
		return (
			<Container
				ref={this.container}
				gradientBackground={this.props.gradientBackground}
				columnDirection={this.props.columnDirection}
			>
				<Name
					labelIcon={this.labelIcon}
					labelText={this.label}
					hideLabel={
						this.props.hideLabel ||
						this.state.hideLabel ||
						this.props.columnDirection
					}
					fontSizeMultiplier={this.state.fontSizeMultiplier}
				>
					{state.runner.name}
				</Name>

				<SocialContainer>
					{socialInfo.map((info, index) => (
						<Social
							key={info.type}
							columnDirection={this.props.columnDirection}
							fontSizeMultiplier={this.state.fontSizeMultiplier}
							icon={socialIcon(info.type) || ''}
							show={showingSocialIndex === index}
						>
							{info.info}
						</Social>
					))}
				</SocialContainer>

				{this.props.showFinishTime && state.finalTime && (
					<ChildrenContainer
						fontSizeMultiplier={this.state.fontSizeMultiplier}
					>
						{state.finalTime}
					</ChildrenContainer>
				)}
				<StyledRuler />
			</Container>
		);
	}

	public componentDidMount() {
		currentRunRep.on('change', this.currentRunChanged);
		timerRep.on('change', this.timerChanged);
	}

	public componentWillUnmount() {
		currentRunRep.removeListener('change', this.currentRunChanged);
		timerRep.removeListener('change', this.timerChanged);
		if (this.socialRotateIntervalTimer !== undefined) {
			clearInterval(this.socialRotateIntervalTimer);
		}
	}

	public async componentDidUpdate() {
		await delay(0);
		const containerRef = this.container.current;
		if (!containerRef) {
			return;
		}
		if (containerRef.offsetWidth >= containerRef.scrollWidth) {
			return;
		}
		if (this.state.hideLabel) {
			this.setState((state) => ({
				fontSizeMultiplier: state.fontSizeMultiplier * 0.95,
			}));
		} else {
			this.setState({hideLabel: true});
		}
	}

	private readonly timerChanged = (newVal: Timer) => {
		const result = newVal.results[this.props.index];
		this.setState({finalTime: result ? result.formatted : undefined});
	};

	private readonly currentRunChanged = (newVal: CurrentRun) => {
		this.setState({
			fontSizeMultiplier: 1,
			hideLabel: false,
			showingSocialIndex: 0,
		});
		const runner = this.calcNewRunner(newVal);
		this.setState({runner: runner || undefined});
		if (!runner) {
			return;
		}
		const socialInfo = calcSocialInfo(runner);
		if (socialInfo.length <= 1) {
			return;
		}
		if (this.socialRotateIntervalTimer !== undefined) {
			clearInterval(this.socialRotateIntervalTimer);
		}
		this.socialRotateIntervalTimer = window.setInterval(() => {
			this.setState((state) => ({
				showingSocialIndex: (state.showingSocialIndex + 1) % 6,
			}));
		}, SOCIAL_ROTATE_INTERVAL_SECONDS * 1000);
	};
}
