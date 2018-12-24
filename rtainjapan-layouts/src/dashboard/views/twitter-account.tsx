import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import {ReplicantName as R, Twitter} from '../../replicants';
import twitterSignIn from '../images/twitter-sign-in.png';

const twitterRep = nodecg.Replicant<Twitter>(R.Twitter);

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
		return userObject && Object.keys(userObject).length > 0 ? (
			<LoggedIn onClick={this.logout}>
				<div>ログイン中：@{userObject.screen_name}</div>
				<Button>ログアウト</Button>
			</LoggedIn>
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
