import React from 'react';
import styled from 'styled-components';
import twitchIcon from '../../images/icon/twitch.png';
import nicoIcon from '../../images/icon/nico.png';
import twitterIcon from '../../images/icon/twitter.png';
import {SocialInfo} from './nameplate';

const Container = styled.div`
	height: 100%;
	position: absolute;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-end;
	opacity: 0;
	transition: opacity 0.33s linear;
`;

export const enum SocialType {
	Twitch,
	Nico,
	Twitter,
}

interface State {
	socialType: SocialType;
	info: string;
}

interface Props {
	socialInfo: State[];
}

export class SocialContainer extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {socialType: SocialType.Twitch, info: ''};
	}

	render() {
		return (
			<Container>
				<img src={this.iconSrc} />
				<SocialInfo>{this.state.info}</SocialInfo>
			</Container>
		);
	}

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
}
