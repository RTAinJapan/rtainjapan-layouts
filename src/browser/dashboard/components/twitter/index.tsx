import styled from "styled-components";
import List from "@mui/material/List";
import {TweetAdd} from "./tweet-add";
import {TweetItem} from "./tweet-item";
import {useReplicant} from "../../../use-replicant";

const Container = styled.div``;

const tweetsTempRep = nodecg.Replicant("tweets-temp");

export const Twitter = () => {
	const tweets = useReplicant("tweets-temp");

	return (
		<Container>
			<List>
				<TweetAdd
					onSubmit={(tweets, onSuccess) => {
						if (tweetsTempRep.value && tweets.text && tweets.name) {
							tweetsTempRep.value.push(tweets);
							onSuccess();
						}
					}}
				/>
				{tweets?.map((tweet, index) => (
					<TweetItem
						key={index}
						tweet={tweet}
						onSubmit={(tweet, onSuccess) => {
							if (tweetsTempRep.value) {
								tweetsTempRep.value = [
									...tweets.slice(0, index),
									...tweets.slice(index + 1),
								];
								nodecg.sendMessage("showTweet", tweet);
								onSuccess();
							}
						}}
						onSubmitFanArt={(tweet, onSuccess) => {
							if (tweetsTempRep.value) {
								tweetsTempRep.value = [
									...tweets.slice(0, index),
									...tweets.slice(index + 1),
								];
								nodecg.sendMessage("showFanArtTweet", tweet);
								onSuccess();
							}
						}}
						onDelete={(onSuccess) => {
							if (tweetsTempRep.value) {
								tweetsTempRep.value = [
									...tweets.slice(0, index),
									...tweets.slice(index + 1),
								];
								onSuccess();
							}
						}}
					/>
				))}
			</List>
		</Container>
	);
};
