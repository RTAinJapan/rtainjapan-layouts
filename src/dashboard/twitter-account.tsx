import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase'
import Button from '@material-ui/core/Button'
import {twitterRep} from '../lib/replicants';

import nodecg from '../lib/nodecg';
import {Twitter} from '../../types/schemas/twitter';
import twitterSignIn from './images/twitter-sign-in.png';

const LoggedIn = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	justify-content: space-between;
	justify-items: center;
	align-items: center;
`;

class App extends React.Component<{}, Twitter> {
	constructor(props: {}) {
		super(props);
		this.state = {
			userObject: null,
			accessToken: null,
			accessTokenSecret: null,
		};
	}

	componentDidMount() {
		twitterRep.on('change', newVal => {
			this.setState(newVal);
		});
	}

	render() {
		if (!this.state.userObject) {
			return (
				<ButtonBase>
					<img onClick={this.login} src={twitterSignIn} />
				</ButtonBase>
			);
		}
		return (
			<LoggedIn onClick={this.logout}>
				<div>ログイン中：@{this.state.userObject.screen_name}</div>
				<Button variant="raised">ログアウト</Button>
			</LoggedIn>
		);
	}

	private readonly login = () => {
		nodecg.sendMessage('getTwitterOauthUrl').then(url => {
			window.parent.location.replace(url);
		});
	};

	private readonly logout = () => {
		nodecg.sendMessage('twitter:logout');
	};
}

ReactDom.render(<App />, document.getElementById('twitter-account'));
