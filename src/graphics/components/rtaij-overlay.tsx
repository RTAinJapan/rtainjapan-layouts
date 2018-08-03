import React from 'react';
import styled, {css} from 'styled-components';
import sample from 'lodash/sample'
import delay from 'delay'

import logoR from '../images/logo-r/index.png';
import logoTainjapan from '../images/logo-tainjapan.png';

const Container = styled.div`
	position: absolute;
	width: 1920px;
	height: 1080px;
	z-index: -1;
`;

const Top = styled.div`
	position: absolute;
	height: 150px;
	width: 100%;
	top: 0;
	background-color: rgba(2, 14, 21, 0.6);
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
	background-color: rgba(2, 14, 21, 0.6);
`;

const LogoTainjapan = styled.img`
	position: absolute;
	top: 15px;
	left: 90px;
`;

const Sponsor = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	right: 0px;
	height: 100%;
	width: 210px;
	border-top-left-radius: 30px;
	background-color: white;
`;

const SponsorLogo = styled.img`
	display: block;
	margin: auto;
	opacity: 0;
	transition: opacity 0.33s linear;
`;

interface State {
	logoR: string;
}
interface Props {
	isBreak?: boolean;
	bottomHeightPx: number;
}
export class RtaijOverlay extends React.Component<Props, State> {
	render() {
		return (
			<Container>
				<Top theme={{isBreak: this.props.isBreak}}>
					<img src={this.state.logoR} />
					<LogoTainjapan src={logoTainjapan} />
				</Top>
				<Bottom style={{height: this.props.bottomHeightPx + 'px'}}>
					<Sponsor>
						<SponsorLogo />
					</Sponsor>
				</Bottom>
			</Container>
		);
	}

	state = {logoR};

	private interval = setInterval(async () => {
		const gifs = await import('../images/logo-r/*.gif')
		const randomGif = sample(Object.values(gifs))
		this.setState({logoR: randomGif});
		await delay(2000)
		this.setState({logoR});
	}, 77 * 1000);

	componentWillUnmount() {
		clearInterval(this.interval);
	}
}
