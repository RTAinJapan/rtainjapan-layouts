import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import {ReplicantName as R, Twitter} from '../../replicants';
import twitterSignIn from '../images/twitter-sign-in.png';
import * as styles from './twitter-account.scss';

const twitterRep = nodecg.Replicant<Twitter>(R.Twitter);

interface State {
	userObject: Twitter['userObject'];
}

class App extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);
		this.state = {
			userObject: undefined,
		};
	}

	public componentDidMount() {
		twitterRep.on('change', (newVal) => {
			this.setState({userObject: newVal.userObject});
		});
	}

	public render() {
		const {userObject} = this.state;
		return userObject ? (
			<div className={styles.loggedIn} onClick={this.logout}>
				<div>ログイン中：@{userObject.screen_name}</div>
				<Button>ログアウト</Button>
			</div>
		) : (
			<ButtonBase>
				<img onClick={this.login} src={twitterSignIn} />
			</ButtonBase>
		);
	}

	private readonly login = async () => {
		const url = await nodecg.sendMessage('twitter:startLogin');
		window.parent.location.replace(url);
	};

	private readonly logout = () => {
		nodecg.sendMessage('twitter:logout');
	};
}

ReactDom.render(<App />, document.getElementById('twitter-account'));
