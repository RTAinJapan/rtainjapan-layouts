import delay from 'delay';
import React from 'react';
import styled, {css} from 'styled-components';
import sample from 'lodash/sample';

import {Tweet} from './lib/tweet';

import blueLogoR from '../images/logo/blue/index.png';
import blueLogoTainjapan from '../images/logo/blue/tainjapan.png';
import blueLogoAnim0 from '../images/logo/blue/animated-0.gif';
import blueLogoAnim1 from '../images/logo/blue/animated-1.gif';
import blueLogoAnim2 from '../images/logo/blue/animated-2.gif';
import blueLogoAnim3 from '../images/logo/blue/animated-3.gif';
import blueLogoAnim4 from '../images/logo/blue/animated-4.gif';
import blueLogoAnim5 from '../images/logo/blue/animated-5.gif';
import blueLogoAnim6 from '../images/logo/blue/animated-6.gif';
import blueLogoAnim7 from '../images/logo/blue/animated-7.gif';
import blueLogoAnim8 from '../images/logo/blue/animated-8.gif';
import blueLogoAnim9 from '../images/logo/blue/animated-9.gif';

import brownLogoR from '../images/logo/brown/index.png';
import brownLogoTainjapan from '../images/logo/brown/tainjapan.png';
import brownLogoAnim0 from '../images/logo/brown/animated-0.gif';
import brownLogoAnim1 from '../images/logo/brown/animated-1.gif';
import brownLogoAnim2 from '../images/logo/brown/animated-2.gif';
import brownLogoAnim3 from '../images/logo/brown/animated-3.gif';
import brownLogoAnim4 from '../images/logo/brown/animated-4.gif';
import brownLogoAnim5 from '../images/logo/brown/animated-5.gif';
import brownLogoAnim6 from '../images/logo/brown/animated-6.gif';
import brownLogoAnim7 from '../images/logo/brown/animated-7.gif';
import brownLogoAnim8 from '../images/logo/brown/animated-8.gif';
import brownLogoAnim9 from '../images/logo/brown/animated-9.gif';
import {Configschema} from '../../../nodecg/generated/configschema';

const {colorTheme, hasSponsor, sponsor} = nodecg.bundleConfig;

const logos = (() => {
	switch (colorTheme) {
		case undefined:
		case 'blue':
			return {
				logoR: blueLogoR,
				logoAnim: [
					blueLogoAnim0,
					blueLogoAnim1,
					blueLogoAnim2,
					blueLogoAnim3,
					blueLogoAnim4,
					blueLogoAnim5,
					blueLogoAnim6,
					blueLogoAnim7,
					blueLogoAnim8,
					blueLogoAnim9,
				],
				logoTainjapan: blueLogoTainjapan,
			};
		case 'brown':
			return {
				logoR: brownLogoR,
				logoAnim: [
					brownLogoAnim0,
					brownLogoAnim1,
					brownLogoAnim2,
					brownLogoAnim3,
					brownLogoAnim4,
					brownLogoAnim5,
					brownLogoAnim6,
					brownLogoAnim7,
					brownLogoAnim8,
					brownLogoAnim9,
				],
				logoTainjapan: brownLogoTainjapan,
			};
	}
})();

const LOGO_TRANSFORM_DURATION_SECONDS = 1;

const Container = styled.div`
	position: absolute;
	width: 1920px;
	height: 1080px;
	z-index: 0;
`;

const Top = styled.div`
	position: absolute;
	height: 150px;
	width: 100%;
	top: 0;
	${colorTheme === 'blue'
		? css`
				background-color: rgba(0, 10, 60, 0.6);
		  `
		: css`
				background-color: rgba(27, 20, 8, 0.6);
		  `}
	${({theme}) =>
		theme.isBreak &&
		css`
			background: none;
		`};
`;

const Bottom = styled.div`
	position: absolute;
	width: 100%;
	bottom: 0;
	${colorTheme === 'blue'
		? css`
				background-color: rgba(0, 10, 60, 0.5);
		  `
		: css`
				background-color: rgba(27, 20, 8, 0.5);
		  `}
`;

const LogoR = styled.img`
	position: absolute;
	z-index: 2;
`;

const LogoTaContainer = styled.div`
	position: absolute;
	z-index: 1;
	top: 15px;
	left: 90px;
	overflow: hidden;
`;

const LogoTainjapan = styled.img`
	transition: transform ${LOGO_TRANSFORM_DURATION_SECONDS}s;
	will-change: transform;
	${(props: {translated: boolean}) =>
		props.translated &&
		css`
			transform: translate(-100%, 0);
		`};
`;

type SponsporProps = {
	opacity: number;
	left?: boolean;
};
const Sponsor = styled.div`
	position: absolute;
	height: 100%;
	width: 210px;
	background: white no-repeat center;
	box-sizing: border-box;
	padding: 15px;

	${(props: SponsporProps) => css`
		& > img,
		& > video {
			opacity: ${props.opacity};
			transition: opacity 1s;
		}
	`}

	${(props: SponsporProps) =>
		props.left
			? css`
					left: 0px;
					border-top-right-radius: 30px;
			  `
			: css`
					right: 0px;
					border-top-left-radius: 30px;
			  `}

	display: grid;
	justify-items: center;
	justify-content: center;
	align-items: center;
	align-content: center;
`;

interface State {
	logoR: string;
	logoRestTransformed: boolean;
	currentSponsorLogoIndex: number;
	sponsorLogo: NonNullable<Configschema['sponsor']>[number] | null;
	sponsorOpacity: number;
}
interface Props {
	isBreak?: boolean;
	bottomHeightPx: number;
	TweetProps?: {
		widthPx?: number;
		leftAttached?: boolean;
		rowDirection?: boolean;
		hideLogo?: boolean;
		maxHeightPx?: number;
	};
	sponsorLeft?: boolean;
}
export class RtaijOverlay extends React.Component<Props, State> {
	public state: State = {
		logoR: logos.logoR,
		logoRestTransformed: false,
		currentSponsorLogoIndex: 0,
		sponsorLogo: sponsor?.[0] || null,
		sponsorOpacity: 1,
	};

	private readonly logoRInterval = setInterval(async () => {
		const randomGif = sample(logos.logoAnim);
		if (!randomGif) {
			return;
		}
		this.setState({logoR: randomGif});
		await delay(5000);
		this.setState({logoR: logos.logoR});
	}, 77 * 1000);

	private readonly sponsorInterval = setInterval(async () => {
		if (!sponsor) {
			return;
		}
		this.setState({sponsorOpacity: 0});
		await delay(1.5 * 1000);
		const logo =
			sponsor[(this.state.currentSponsorLogoIndex + 1) % sponsor.length];
		this.setState((state) => ({
			sponsorLogo: logo,
			sponsorOpacity: 1,
			currentSponsorLogoIndex: state.currentSponsorLogoIndex + 1,
		}));
	}, 12 * 1000);

	public render() {
		const sponsorLogo = this.state.sponsorLogo;

		const logoComponent =
			sponsorLogo &&
			(sponsorLogo.type === 'image' ? (
				<img src={sponsorLogo.url}></img>
			) : (
				<video
					width={180}
					height={120}
					muted
					autoPlay
					controls={false}
					src={sponsorLogo.url}
					style={{overflow: 'hidden'}}
				></video>
			));

		return (
			<Container>
				<Top theme={{isBreak: this.props.isBreak}}>
					<LogoR src={this.state.logoR} />
					<LogoTaContainer>
						<LogoTainjapan
							translated={this.state.logoRestTransformed}
							src={logos.logoTainjapan}
						/>
					</LogoTaContainer>
				</Top>
				<Bottom style={{height: `${this.props.bottomHeightPx}px`}}>
					{hasSponsor && sponsor && (
						<Sponsor
							opacity={this.state.sponsorOpacity}
							left={this.props.sponsorLeft}
						>
							{logoComponent}
						</Sponsor>
					)}
				</Bottom>
				<Tweet
					{...this.props.TweetProps}
					beforeShowingTweet={
						this.props.TweetProps && this.props.TweetProps.hideLogo
							? this.beforeShowingTweet
							: undefined
					}
					afterShowingTweet={
						this.props.TweetProps && this.props.TweetProps.hideLogo
							? this.afterShowingTweet
							: undefined
					}
				/>
			</Container>
		);
	}

	public componentWillUnmount() {
		clearInterval(this.logoRInterval);
		clearInterval(this.sponsorInterval);
	}

	private readonly beforeShowingTweet = async () => {
		this.setState({logoRestTransformed: true});
		await delay(LOGO_TRANSFORM_DURATION_SECONDS * 1000);
	};

	private readonly afterShowingTweet = async () => {
		this.setState({logoRestTransformed: false});
		await delay(LOGO_TRANSFORM_DURATION_SECONDS * 1000);
	};
}
