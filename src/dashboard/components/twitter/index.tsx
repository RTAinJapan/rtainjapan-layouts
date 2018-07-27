import React from 'react';
import styled from 'styled-components';
import {BorderedBox} from '../lib/bordered-box';
import {tweetsRep} from '../../../lib/replicants';
import {Tweets} from '../../../../types/schemas/tweets';
import {TweetItem} from './tweet-item';

const Container = BorderedBox.extend`
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
	gap: 16px;
`;

export class Twitter extends React.Component<{}, {tweets: Tweets}> {
	constructor(props: {}) {
		super(props);
		this.state = {tweets: []};
	}

	componentDidMount() {
		tweetsRep.on('change', this.tweetRepChange);
	}

	render() {
		return (
			<Container>
				<Label>ツイート表示管理</Label>
				{this.state.tweets.length === 0 ? (
					<Empty>表示するツイートがありません</Empty>
				) : (
					<TweetContainer>
						{this.state.tweets.map(tweet => (
							<TweetItem tweet={tweet} key={tweet.id} />
						))}
					</TweetContainer>
				)}
			</Container>
		);
	}

	componentWillUnmount() {
		tweetsRep.removeListener('change', this.tweetRepChange);
	}

	private readonly tweetRepChange = (newVal: Tweets) => {
		this.setState({tweets: newVal});
	};
}
