import {styled} from "@mui/material/styles";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import {TweetAdd} from "./tweet-add";
import {TweetItem} from "./tweet-item";
import {useReplicant} from "../../../use-replicant";

const Container = styled("div")({});

const tweetsTempRep = nodecg.Replicant("tweets-temp");
const tweetsTempImagesRep = nodecg.Replicant("tweets-temp-images");

export const Twitter = () => {
	const tweets = useReplicant("tweets-temp");

	const queuedCount = tweets?.filter((tweet) => tweet.queued).length ?? 0;

	return (
		<Container>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					padding: "8px 16px",
				}}
			>
				<Button
					variant='contained'
					disabled={queuedCount === 0}
					onClick={() => {
						nodecg.sendMessage("startTweetQueue");
					}}
				>
					まとめて表示
				</Button>
				<span>キュー: {queuedCount}件</span>
			</div>
			<List>
				<TweetAdd
					onSubmit={(tweets, onSuccess) => {
						if (
							tweetsTempRep.value &&
							tweets.text &&
							tweets.name &&
							tweets.userId &&
							tweets.service
						) {
							if (
								tweets.image &&
								tweetsTempImagesRep.value?.includes(tweets.image)
							) {
								alert("該当の画像URLは登録済です。");
								return;
							}
							tweetsTempRep.value.push(tweets);
							if (tweets.image) {
								tweetsTempImagesRep.value?.push(tweets.image);
							}
							onSuccess();
						}
					}}
				/>
				{tweets?.map((tweet, index) => (
					<TweetItem
						key={index}
						tweet={tweet}
						onToggleQueue={() => {
							if (tweetsTempRep.value) {
								tweetsTempRep.value = tweets.map((t, i) =>
									i === index ? {...t, queued: !t.queued} : t,
								);
							}
						}}
						onDelete={() => {
							if (tweetsTempRep.value) {
								tweetsTempRep.value = [
									...tweets.slice(0, index),
									...tweets.slice(index + 1),
								];
							}
						}}
					/>
				))}
			</List>
		</Container>
	);
};
