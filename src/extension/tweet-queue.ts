import type {NodeCG} from "./nodecg";

// ファンアート表示のアニメーション (フェードイン1秒 + 表示20秒 + フェードアウト1秒)
// に画像読み込みなどの余裕を加えた、1件あたりの表示間隔。
const DISPLAY_INTERVAL_MS = 24 * 1000;

const DEFAULT_SETUP_SCENE_NAME = "Setup";

export const setupTweetQueue = (nodecg: NodeCG) => {
	const logger = new nodecg.Logger("tweet-queue");
	const tweetsTempRep = nodecg.Replicant("tweets-temp");
	const currentSceneRep = nodecg.Replicant("obs-current-scene");
	// まとめて表示の処理中かどうか。ダッシュボードやStream Deckのボタン表示用。
	const playingRep = nodecg.Replicant("tweet-queue-playing");

	const setupSceneName =
		nodecg.bundleConfig.obs?.setupSceneName ?? DEFAULT_SETUP_SCENE_NAME;

	let timer: NodeJS.Timeout | undefined;

	const isPlaying = () => playingRep.value === true;

	const stop = () => {
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}
		// 追加のキュー消費を止めるだけ。表示中のファンアートは規定時間まで残る
		// (グラフィック側のアニメーションが独立して完了するため)。
		playingRep.value = false;
	};

	// OBSのプログラム側がSetupシーンを表示しているかどうか。
	const isOnSetupScene = () => currentSceneRep.value === setupSceneName;

	const consumeNext = () => {
		if (!isPlaying()) {
			return;
		}
		// Setup以外のシーンに切り替わっていたら表示処理を停止する。
		if (!isOnSetupScene()) {
			stop();
			return;
		}
		const list = tweetsTempRep.value;
		if (!list) {
			stop();
			return;
		}
		const index = list.findIndex((tweet) => tweet.queued);
		const tweet = index === -1 ? undefined : list[index];
		if (!tweet) {
			// キューが空になったら終了。
			stop();
			return;
		}

		if (tweet.image) {
			nodecg.sendMessage("showFanArtTweet", tweet);
		} else {
			nodecg.sendMessage("showTweet", tweet);
		}

		// 表示したツイートはレプリカントの一覧からも削除する。
		tweetsTempRep.value = [...list.slice(0, index), ...list.slice(index + 1)];

		timer = setTimeout(consumeNext, DISPLAY_INTERVAL_MS);
	};

	// 「表示開始」。ダッシュボード/Stream Deck 共通の入口。
	nodecg.listenFor("startTweetQueue", () => {
		if (isPlaying()) {
			return;
		}
		// Setupを表示しているときのみキューの消化を開始する。
		if (!isOnSetupScene()) {
			logger.warn(
				`「表示開始」を無視しました: 現在のシーンが「${setupSceneName}」ではありません (現在: 「${
					currentSceneRep.value ?? ""
				}」)`,
			);
			return;
		}
		playingRep.value = true;
		consumeNext();
	});

	// 「表示停止」。ダッシュボード/Stream Deck 共通の入口。
	nodecg.listenFor("stopTweetQueue", () => {
		if (!isPlaying()) {
			return;
		}
		logger.info("「表示停止」により、まとめて表示を停止しました");
		stop();
	});

	// Setup以外へ切り替わったら即座に停止する。
	// 再開はユーザーが再度「表示開始」を押すまで行わない。
	currentSceneRep.on("change", (newValue) => {
		if (isPlaying() && newValue !== setupSceneName) {
			logger.info(
				`シーンが「${setupSceneName}」から切り替わったため、まとめて表示を停止しました`,
			);
			stop();
		}
	});

	// 起動時 (レプリカントが前回値を復元している可能性) は必ず停止状態に戻す。
	playingRep.value = false;
};
