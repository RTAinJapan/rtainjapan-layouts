import React from 'react';
import {Tweets} from '../../../../types/schemas/tweets';
import styled from '../../../../node_modules/styled-components';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import ja from 'date-fns/locale/ja';

interface Props {
	tweet: Tweets[0];
}
interface State {
	timeago: string;
}

const Container = styled.div``;

export class TweetItem extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = this.calcTimeago();
		setInterval(() => {
			this.setState(this.calcTimeago());
		}, 10 * 1000);
	}

	render() {
		return (
			<Container>
				<header>
					<a href={this.tweetUrl()} target="_blank">
						<time dateTime={this.props.tweet.createdAt}>
							{this.state.timeago}
						</time>
					</a>
					<a href={this.profileUrl()}>
						<img src={this.props.tweet.user.profileImageUrl}/>
						<span>{this.props.tweet.user.name}</span>
						<span>@{this.props.tweet.user.screenName}</span>
					</a>
				</header>
				{this.props.tweet.text}
			</Container>
		);
	}

	private readonly tweetUrl = () => {
		const {id} = this.props.tweet;
		return `${this.profileUrl()}/statuses/${id}`;
	};

	private readonly profileUrl = () => {
		const {
			user: {screenName},
		} = this.props.tweet;
		return `https://twitter.com/${screenName}`;
	};

	private readonly calcTimeago = () => {
		return {
			timeago: distanceInWordsToNow(this.props.tweet.createdAt, {
				locale: ja,
				addSuffix: true,
			}),
		};
	};
}
