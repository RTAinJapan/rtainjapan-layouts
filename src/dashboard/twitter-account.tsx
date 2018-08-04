// Packages
import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

// MUI Core
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';

// Ours
import nodecg from '../lib/nodecg';
import {Twitter} from '../../types/schemas/twitter';
import twitterSignIn from './images/twitter-sign-in.png';
import {twitterRep} from '../lib/replicants';

const LoggedIn = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	justify-content: space-between;
	justify-items: center;
	align-items: center;
`;

interface State {
	userObject: Twitter['userObject'];
}

class App extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);
		this.state = {
			userObject: null,
		};
	}

	public componentDidMount() {
		twitterRep.on('change', newVal => {
			this.setState({userObject: newVal.userObject});
		});
	}

	public render() {
		const {userObject} = this.state;
		return userObject ? (
			<LoggedIn onClick={this.logout}>
				<div>ログイン中：@{userObject.screen_name}</div>
				<Button variant="raised">ログアウト</Button>
			</LoggedIn>
		) : (
			<ButtonBase>
				<img onClick={this.login} src={twitterSignIn} />
			</ButtonBase>
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
