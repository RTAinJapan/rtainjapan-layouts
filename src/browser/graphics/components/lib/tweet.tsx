import delay from 'delay';
import React from 'react';
import styled, {css} from 'styled-components';
import {Tweets} from '../../../../nodecg/replicants';
import {TweetHighlighter} from '../../../tweet-highlighter';
import twitterBlueIcon from '../../images/icon/tweet_blue.png';

const USE_PROFILE_IMAGE = false;
const TWEET_TRANSITION_SECONDS = 2;
const TWEET_SHOWN_DURATION_SECONDS = 10;

const Header = styled.div`
	line-height: 24px;
	color: #55acee;
	display: grid;
	grid-template-columns: 30px 1fr;
	align-content: center;
`;

const ProfilePicture = styled.img`
	height: 30px;
	width: 100%;
	${USE_PROFILE_IMAGE &&
		css`
			border-radius: 100%;
		`}
`;

const Content = styled.div`
	line-height: 30px;
	white-space: pre-line;
	display: grid;
	align-content: center;
	justify-content: center;
`;

interface ContainerProps {
	widthPx?: number;
	shown: boolean;
	leftAttached?: boolean;
	rowDirection?: boolean;
	maxHeightPx?: number;
}
const Container = styled.div`
	font-size: 24px;
	font-family: 'MigMix 2P';
	position: absolute;
	background-color: #ffffff;
	box-sizing: border-box;
	display: flex;
	transition: transform ${TWEET_TRANSITION_SECONDS}s;
	overflow: hidden;
	will-change: tranform;

	${({maxHeightPx}: ContainerProps) =>
		maxHeightPx &&
		css`
			max-height: ${maxHeightPx}px;
		`};
	${({widthPx}: ContainerProps) =>
		widthPx &&
		css`
			width: ${widthPx}px;
		`};

	${({leftAttached}: ContainerProps) =>
		leftAttached
			? css`
					top: 165px;
					left: 0px;
					border-top-right-radius: 25px;
					border-bottom-right-radius: 25px;
					transform: translateX(-100%);
			  `
			: css`
					top: 0px;
					left: 150px;
					border-bottom-left-radius: 25px;
					border-bottom-right-radius: 25px;
					transform: translateY(-100%);
			  `};

	${({rowDirection}: ContainerProps) =>
		rowDirection
			? css`
					top: 0px;
					right: 0px;
					left: auto;
					height: 150px;
					flex-flow: row nowrap;
					padding: 15px 30px 15px 30px;
					align-items: stretch;
					border-bottom-right-radius: 0;

					& > ${Header} {
						height: 100%;
						border-right: 3px solid #55acee;
						padding-right: 15px;
					}

					& > ${Content} {
						height: 100%;
						width: ${550 * 1.5}px;
						margin-left: 15px;
					}
			  `
			: css`
					flex-flow: column nowrap;
					padding: 15px 30px 27px 30px;

					& > ${Header} {
						height: 30px;
						border-bottom: 3px solid #55acee;
						padding-bottom: 6px;
					}

					& > ${Content} {
						margin-top: 12px;
					}
			  `};

	${({shown}: ContainerProps) =>
		shown &&
		css`
			transform: translate(0, 0);
		`};
`;

interface Props {
	widthPx?: number;
	leftAttached?: boolean;
	rowDirection?: boolean;
	beforeShowingTweet?(): Promise<void>;
	afterShowingTweet?(): Promise<void>;
}

interface State {
	tweetQueue: Tweets;
	showingTweet?: Tweets[0];
	shown: boolean;
}

export class Tweet extends React.Component<Props, State> {
	public state: State = {tweetQueue: [], shown: false};

	public componentDidMount() {
		nodecg.listenFor('showTweet', this.showTweetHandler);
	}

	public componentWillUnmount() {
		nodecg.unlisten('showTweet', this.showTweetHandler);
	}

	// Carefully coded to prevent infinite updates, be careful!
	public async componentDidUpdate() {
		// Don't do anything if tweet is already set
		// If this condition doesn't match, next time the tweet is unset is when this async function ends
		// So infinite loop does not happen
		if (this.state.showingTweet) {
			return;
		}
		// Don't do anything if nothing is in queue
		if (this.state.tweetQueue.length === 0) {
			return;
		}
		// Set the tweet, and pop the queue
		this.setState((state) => ({
			showingTweet: state.tweetQueue[0],
			tweetQueue: state.tweetQueue.slice(1),
		}));
		// Do the given action
		if (this.props.beforeShowingTweet) {
			await this.props.beforeShowingTweet();
		}
		// Show the tweet and wait for the transition
		this.setState({shown: true});
		await delay(TWEET_TRANSITION_SECONDS * 1000);
		// Show duration
		await delay(TWEET_SHOWN_DURATION_SECONDS * 1000);
		// Hide the tweet, and wait for the transition
		this.setState({shown: false});
		await delay(TWEET_TRANSITION_SECONDS * 1000);
		// If there is nothing to show next, do the given action
		if (
			this.state.tweetQueue.length === 0 &&
			this.props.afterShowingTweet
		) {
			await this.props.afterShowingTweet();
		}
		// Unset the tweet, this immediately triggers componentDidUpdate and next loop happens
		this.setState({showingTweet: undefined});
	}

	public render() {
		const {showingTweet} = this.state;
		return (
			<Container shown={this.state.shown} {...this.props}>
				{showingTweet && (
					<Header>
						<ProfilePicture
							src={
								USE_PROFILE_IMAGE
									? showingTweet.user.profileImageUrl
									: twitterBlueIcon
							}
						/>
						<div>@{showingTweet.user.screenName}</div>
					</Header>
				)}
				{showingTweet && (
					<Content>
						<TweetHighlighter
							text={showingTweet.text.replace(/\n/g, ' ')}
						/>
					</Content>
				)}
			</Container>
		);
	}

	private readonly showTweetHandler = async (tweet: Tweets[0]) => {
		this.setState((state) => ({
			tweetQueue: [...state.tweetQueue, tweet],
		}));
	};
}
