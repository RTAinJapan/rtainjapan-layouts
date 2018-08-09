// Packages
import React from 'react';
import styled, {css} from 'styled-components';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ja from 'date-fns/locale/ja';

// MUI Core
import IconButton from '@material-ui/core/IconButton';

// MUI Icons
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

// Ours
import {Tweets} from '../../../../types/schemas/tweets';
import nodecg from '../../../lib/nodecg';

interface Props {
	tweet: Tweets[0];
}

interface State {
	timeago: string;
}

const a = styled.a`
	text-transform: none;
	text-decoration: none;
`;

const Container = styled.div`
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: 16px;

	&:not(:last-of-type) {
		border-bottom: 1px solid #3c3c3c;
		padding-bottom: 16px;
	}
`;

const Tweet = styled.div`
	display: grid;
	grid-template-rows: auto 1fr;
`;

const Controls = styled.div`
	display: grid;
	grid-auto-rows: auto;
	grid-auto-flow: row;
	align-content: center;
`;

const TweetLink = a.extend`
	float: right;
`;

const ProfileLink = a.extend``;

const Name = styled.span`
	color: black;
	font-weight: bold;
	font-size: 16px;
`;

const grayText = css`
	color: #888;
	font-size: 14px;
`;
const ScreenName = styled.span`
	${grayText};
`;
const Time = styled.time`
	${grayText};
`;

const Avatar = styled.img`
	position: relative;
	top: 0;
	left: 0;
	width: 48px;
	height: 48px;
	border-radius: 48px;
`;

const TweetHeader = styled.header``;

const TweetText = styled.div`
	align-self: start;
`;

export class TweetItem extends React.Component<Props, State> {
	public state: State = this.calcTimeago();

	private readonly interval = setInterval(() => {
		this.setState(this.calcTimeago());
	}, 60 * 1000);

	public render() {
		return (
			<Container>
				<Avatar src={this.props.tweet.user.profileImageUrl} />
				<Tweet>
					<TweetHeader>
						<ProfileLink href={this.profileUrl()}>
							<Name>{this.props.tweet.user.name}</Name>
							<ScreenName>
								@{this.props.tweet.user.screenName}
							</ScreenName>
						</ProfileLink>
						<TweetLink href={this.tweetUrl()} target="_blank">
							<Time dateTime={this.props.tweet.createdAt}>
								{this.state.timeago}
							</Time>
						</TweetLink>
					</TweetHeader>
					<TweetText>{this.props.tweet.text}</TweetText>
				</Tweet>
				<Controls>
					<IconButton title="配信に表示" onClick={this.selectTweet}>
						<CheckIcon />
					</IconButton>
					<IconButton title="削除する" onClick={this.discardTweet}>
						<ClearIcon />
					</IconButton>
				</Controls>
			</Container>
		);
	}

	public componentWillUnmount() {
		clearInterval(this.interval);
	}

	private readonly selectTweet = () => {
		nodecg.sendMessage('selectTweet', this.props.tweet.id);
	};

	private readonly discardTweet = () => {
		nodecg.sendMessage('discardTweet', this.props.tweet.id);
	};

	private readonly tweetUrl = () => {
		const {id} = this.props.tweet;
		return `${this.profileUrl()}/status/${id}`;
	};

	private readonly profileUrl = () => {
		const {
			user: {screenName},
		} = this.props.tweet;
		return `https://twitter.com/${screenName}`;
	};

	private calcTimeago() {
		return {
			timeago: distanceInWordsToNow(this.props.tweet.createdAt, {
				locale: ja,
				addSuffix: true,
			}),
		};
	}
}
