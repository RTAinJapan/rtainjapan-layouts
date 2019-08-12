import delay from 'delay';
import React from 'react';
import styled, {css} from 'styled-components';
import sample from 'lodash/sample';

import logoR from '../images/logo/index.png';
import logoTainjapan from '../images/logo/tainjapan.png';
import {Tweet} from './lib/tweet';
import logoAnim0 from '../images/logo/animated-0.gif';
import logoAnim1 from '../images/logo/animated-1.gif';
import logoAnim2 from '../images/logo/animated-2.gif';
import logoAnim3 from '../images/logo/animated-3.gif';
import logoAnim4 from '../images/logo/animated-4.gif';
import logoAnim5 from '../images/logo/animated-5.gif';
import logoAnim6 from '../images/logo/animated-6.gif';
import logoAnim7 from '../images/logo/animated-7.gif';
import logoAnim8 from '../images/logo/animated-8.gif';
import logoAnim9 from '../images/logo/animated-9.gif';

const logoList = [
	logoAnim0,
	logoAnim1,
	logoAnim2,
	logoAnim3,
	logoAnim4,
	logoAnim5,
	logoAnim6,
	logoAnim7,
	logoAnim8,
	logoAnim9,
];

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
	background-color: rgba(27, 20, 8, 0.6);
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
	background-color: rgba(27, 20, 8, 0.6);
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
	${(props: {translated: boolean}) =>
		props.translated &&
		css`
			transform: translate(-100%, 0);
		`};
`;

const Sponsor = styled.div`
	position: absolute;
	right: 0px;
	height: 100%;
	width: 210px;
	border-top-left-radius: 30px;
	background-color: white;
	box-sizing: border-box;
	padding: 15px;

	display: grid;
	justify-items: center;
	align-items: center;
`;

interface State {
	logoR: string;
	logoRestTransformed: boolean;
}
interface Props {
	showSponser?: boolean;
	isBreak?: boolean;
	bottomHeightPx: number;
	TweetProps?: {
		widthPx?: number;
		leftAttached?: boolean;
		rowDirection?: boolean;
		hideLogo?: boolean;
		maxHeightPx?: number;
	};
}
export class RtaijOverlay extends React.Component<Props, State> {
	public state = {logoR, logoRestTransformed: false};

	private readonly logoRInterval = setInterval(async () => {
		const randomGif = sample(logoList);
		if (!randomGif) {
			return;
		}
		this.setState({logoR: randomGif});
		await delay(5000);
		this.setState({logoR});
	}, 77 * 1000);

	public render() {
		return (
			<Container>
				<Top theme={{isBreak: this.props.isBreak}}>
					<LogoR src={this.state.logoR} />
					<LogoTaContainer>
						<LogoTainjapan
							translated={this.state.logoRestTransformed}
							src={logoTainjapan}
						/>
					</LogoTaContainer>
				</Top>
				<Bottom style={{height: `${this.props.bottomHeightPx}px`}}>
					{this.props.showSponser && <Sponsor />}
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
