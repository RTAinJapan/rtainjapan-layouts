import React from 'react';
import styled from 'styled-components';
import {Tweets} from '../../../lib/replicant';
import {BorderedBox} from '../lib/bordered-box';
import {TweetItem} from './tweet-item';

const tweetsRep = nodecg.Replicant<Tweets>('tweets');

const Container = styled(BorderedBox)`
	height: calc(100vh - 32px);
	display: grid;
	grid-template-rows: auto 1fr;
	justify-items: stretch;
`;

const Label = styled.div`
	font-weight: 700;
	background-color: #c4c4c4;
	text-align: center;
`;

const Empty = styled.div`
	margin: 16px;
	box-sizing: border-box;
	border: 4px dashed #b7b7b7;
	display: grid;
	align-items: center;
	justify-items: center;
`;

const TweetContainer = styled.div`
	padding: 16px;
	overflow-y: scroll;
	display: grid;
	grid-auto-flow: row;
	align-content: start;
	grid-gap: 16px;
`;

export class Twitter extends React.Component<{}, {tweets: Tweets}> {
	constructor(props: {}) {
		super(props);
		this.state = {tweets: []};
	}

	public componentDidMount() {
		tweetsRep.on('change', this.tweetRepChange);
	}

	public render() {
		return (
			<Container>
				<Label>ツイート表示管理</Label>
				{this.state.tweets.length === 0 ? (
					<Empty>表示するツイートがありません</Empty>
				) : (
					<TweetContainer>
						{this.state.tweets.map(tweet => (
							<TweetItem key={tweet.id} tweet={tweet} />
						))}
					</TweetContainer>
				)}
			</Container>
		);
	}

	public componentWillUnmount() {
		tweetsRep.removeListener('change', this.tweetRepChange);
	}

	private readonly tweetRepChange = (newVal: Tweets) => {
		this.setState({tweets: newVal});
	};
}
