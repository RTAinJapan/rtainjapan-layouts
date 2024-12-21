// グラデ色定義はコンポーネント埋込

export const text = {
	/** 基本文字色 文字色全般 */
	normal: "rgb(255, 255, 255)",
	/** 基本文字色 強調色、 */
	highlight: "rgb(255, 255, 82)",
	/** 下部帯文字色 */
	omnibar: "rgb(60, 60, 60)",
	/** タイマー色 準備中 */
	timerPaused: "rgb(192, 192, 192)",
	/** タイマー色 動作中 */
	timerRunning: "rgb(255, 255, 255)",
	/** タイマー色 クリア後 */
	timerFinished: "rgb(255, 255, 82)",
};

export const border = {
	/** 走者カメラ枠 線 */
	camera: "rgb(255, 255, 255)",
	/** スポンサー枠 線 */
	sponsor: "rgb(255, 255, 255)",
	/** 曲名枠 線 */
	music: "rgb(255, 255, 255)",
	/** 走者名枠、解説者名枠 線 */
	name: "rgb(255, 255, 255)",
	/** Twitter枠 線 */
	tweet: "rgb(255, 255, 255)",
	/** エンドロール枠 線 */
	credit: "rgb(255, 255, 255)",
	/** スピーチ映像枠 */
	speechCamera: "rgb(255, 255, 255)",
};

export const background = {
	/** カメラ枠 背景 */
	camera: "rgba(0, 0, 0, 0.45)",
	/** スポンサー枠 背景 */
	sponsor: "rgba(0, 0, 0, 0.45)",
	/** Twitter枠 背景 */
	tweet: "rgba(0, 0, 0, 0.45)",
	/** 走者名枠、解説者名枠 背景 */
	name: "rgba(0, 0, 0, 0.25)",
	/** 下部帯 背景 */
	omnibar: "rgb(230,230,230)",
	/** エンドロール枠 背景 */
	credit: "rgba(0, 0, 0, 0.45)",
};

export const bidwar = {
	/** Bid War 進捗バー背景 */
	progressFrame: "rgb(180,180,180)",
	/** Bid War 進捗バー本体 */
	progress: "rgb(60,60,60)",
};

/** セットアップ画面の色 */
export const setup = {
	/** セットアップ画面 基本文字色 */
	text: "rgb(255, 255, 255)",
	/** 各種枠の線 */
	frameBorder: "rgb(255,255,255)",
	/** 各種枠の背景 */
	frameBg: "rgba(37, 48, 58, 0.6)",
};
