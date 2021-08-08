import React from "react";
import styled from "styled-components";
import {Tweets} from "../../../../nodecg/replicants";
import {BorderedBox} from "../lib/bordered-box";
import {TweetItem} from "./tweet-item";

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

const EmptyContainer = styled.div`
	margin: 16px;
	box-sizing: border-box;
	border: 4px dashed #b7b7b7;
	display: grid;
	align-items: center;
	justify-items: center;
`;

const TweetListContainer = styled.div`
	padding: 16px;
	overflow-y: scroll;
	display: grid;
	grid-auto-flow: row;
	align-content: start;
	grid-gap: 16px;
`;

interface State {
	tweets: Tweets;
}

export class Twitter extends React.Component<{}, State> {
	tweetsRep = nodecg.Replicant("tweets");
	state: State = {tweets: []};

	componentDidMount() {
		this.tweetsRep.on("change", (newVal: Tweets) => {
			if (!newVal) {
				return;
			}
			this.setState({tweets: newVal});
		});
	}
	componentWillUnmount() {
		this.tweetsRep.removeAllListeners("change");
	}

	render() {
		return (
			<Container>
				<Label>ツイート表示管理</Label>
				{this.twitterContentElement}
			</Container>
		);
	}

	private get twitterContentElement() {
		if (this.state.tweets.length === 0) {
			return <EmptyContainer>表示するツイートがありません</EmptyContainer>;
		} else {
			return (
				<TweetListContainer>
					{this.state.tweets.map((tweet) => (
						<TweetItem key={tweet.id} tweet={tweet} />
					))}
				</TweetListContainer>
			);
		}
	}
}
