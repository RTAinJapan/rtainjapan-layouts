import {styled} from "@mui/material/styles";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import {TweetAdd} from "./tweet-add";
import {TweetItem} from "./tweet-item";
import {useReplicant} from "../../../use-replicant";

const Container = styled("div")({});

const tweetsTempRep = nodecg.Replicant("tweets-temp");
const tweetsTempImagesRep = nodecg.Replicant("tweets-temp-images");

const setupSceneName = nodecg.bundleConfig.obs?.setupSceneName ?? "Setup";

// リストが伸び続けないように、ツイート一覧だけをこの高さ内でスクロールさせる。
const LIST_MAX_HEIGHT = 500;

export const Twitter = () => {
	const tweets = useReplicant("tweets-temp");
	const currentScene = useReplicant("obs-current-scene");
	const playing = useReplicant("tweet-queue-playing");

	const queuedCount = tweets?.filter((tweet) => tweet.queued).length ?? 0;
	// シーンが判明していて Setup 以外のときだけ開始をブロックする。
	// シーン不明 (OBS未接続など) のときは制約を緩めて押せるようにする。
	const sceneBlocked = Boolean(currentScene) && currentScene !== setupSceneName;
	const isPlaying = playing === true;

	return (
		<Container>
			{/* スクロール対象外: 表示開始/停止ボタン */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					padding: "8px 16px",
				}}
			>
				{isPlaying ? (
					<Button
						variant='contained'
						color='error'
						onClick={() => {
							nodecg.sendMessage("stopTweetQueue");
						}}
					>
						表示停止
					</Button>
				) : (
					<Button
						variant='contained'
						disabled={queuedCount === 0 || sceneBlocked}
						onClick={() => {
							nodecg.sendMessage("startTweetQueue");
						}}
					>
						表示開始
					</Button>
				)}
				<span>キュー: {queuedCount}件</span>
			</div>
			{/* スクロール対象外: ツイート登録フォーム */}
			<List disablePadding>
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
			</List>
			{/* スクロール対象: ツイート一覧 */}
			<List
				style={{
					maxHeight: LIST_MAX_HEIGHT,
					overflowY: "auto",
					borderTop: "1px solid rgba(0, 0, 0, 0.12)",
				}}
			>
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
