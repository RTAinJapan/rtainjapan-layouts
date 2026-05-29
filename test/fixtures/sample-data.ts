// スクリーンショット撮影に用いるReplicant

// 各game-scene のレイアウトは最大4人の runner を扱うので、サンプルは常に4人分。
// レイアウトが N 人用なら先頭 N 人だけ描画される
const sampleRunners = [
	{
		pk: 1,
		name: "speedy_taro",
		twitch: "speedy_taro",
		twitter: "speedy_taro",
		youtube: "speedy_taro",
		camera: true,
	},
	{
		pk: 2,
		name: "ranner_jiro",
		twitch: "ranner_jiro",
		twitter: "ranner_jiro",
		youtube: "ranner_jiro",
		camera: true,
	},
	{
		pk: 3,
		name: "racer_saburo",
		twitch: "racer_saburo",
		twitter: "racer_saburo",
		nico: "racer_saburo",
		camera: false,
	},
	{
		pk: 4,
		name: "kaisoku_shiro",
		twitch: "kaisoku_shiro",
		youtube: "kaisoku_shiro",
		camera: true,
	},
];

// commentators は schema 上 minItems=2/maxItems=2 のタプルで、各要素は
// オブジェクト or null。「人数」は非 null 要素の数で表現する。
const sampleCommentators = [
	{name: "kaisetsu_alpha", twitch: "kaisetsu_alpha", twitter: "kaisetsu_alpha"},
	{name: "kaisetsu_beta", twitter: "kaisetsu_beta"},
];

const sampleRun = {
	pk: 100,
	index: 3,
	title: "サンプルゲーム デラックス",
	englishTitle: "Sample Game Deluxe",
	category: "Any%",
	platform: "PC",
	releaseYear: 2023,
	runDuration: "0:30:00",
	setupDuration: "0:05:00",
	camera: true,
	runners: sampleRunners,
	commentators: sampleCommentators,
	twitchGameId: "0",
	completedChecklist: [],
};

// 解説者数のバリエーション
export const commentatorVariations: Array<{
	label: string;
	commentators: unknown[];
}> = [
	{label: "0commentators", commentators: [null, null]},
	{label: "1commentator", commentators: [sampleCommentators[0], null]},
	// "2commentators" はデフォルト pass でカバーするので別撮影不要。
];

// バリエーション撮影で使う game-scene レイアウト。
// solo / race の代表を1つずつ選んで 0/1 人パターンを別撮りする。
export const commentatorVariationLayouts: string[] = [
	"16x9-1", // LShapedSolo: 1 runner
	"16x9-4", // VerticalRace: 4 runner race
];

// 発光バリエーション撮影。今回追加した「走者マイク発光 / 解説マイク発光 /
// ゲーム音 on-air 発光」を、nameplate のバリエーションを網羅する代表
// レイアウトで撮る。全 graphics レイアウトの網羅は不要で、nameplate の
// 見た目の種類 (solo=two-row / race-horizontal=single / race-vertical=two-row、
// および commentator=two-row) を押さえることが目的。
//   runners[i]      : 走者 i のマイク発光 (runner アイコン点灯)
//   games[i]        : 走者 i のゲーム音 on-air (sound アイコン点灯、race のみ)
//   commentators[i] : 解説 i のマイク発光 (commentary アイコン点灯)
// 4 走者 / 2 解説に対し、mic のみ・game のみ・両方・無し・解説 mic を1画面で混在
// させ、各 nameplate の発光状態を一度に確認できるようにする。
export const audioGlowState = {
	runners: [true, false, true, false],
	commentators: [true, false],
	games: [false, true, true, false],
};
export const audioGlowLayouts: string[] = [
	"16x9-1", // solo: runner=two-row / commentator=two-row (sound アイコンは出ない)
	"16x9-2", // race-horizontal: runner=single-row + sound アイコン
	"16x9-4", // race-vertical: runner=two-row + sound アイコン
];

// game-scene を「start (= 走行中)」状態と「finished (= 完走後)」状態の両方で
// 撮るための timer fixture。
//
// startTimer はデフォルトの fixtures.timer と同等で、グローバルが Running、
// results は全 null。各走者 nameplate のタイム表示は (race=true でも) 非表示
// になる。
//
// finishedTimer はグローバルが Finished、results[0..2] が完走、results[3] が
// リタイア (forfeit=true) の状態。
// - 1人 layout (race=false) では global timer が Finished 色で表示される
// - 2〜4人 layout (race=true) では各走者の results[i] に応じて完走タイム /
//   リタイア表示が出る
// この1つの fixture で全 game-scene layout の完走後表示をカバーする。
const finishedTimestamp = Date.now();

export const startTimer = {
	raw: 754,
	hours: 0,
	minutes: 12,
	seconds: 34,
	formatted: "0:12:34",
	timestamp: finishedTimestamp,
	timerState: "Running",
	forfeit: false,
	results: [null, null, null, null],
};

export const finishedTimer = {
	// 全走者が完走 or リタイアした状態のグローバルタイマー。
	// 経過時間は最遅走者のタイムに合わせる。
	raw: 2285,
	hours: 0,
	minutes: 38,
	seconds: 5,
	formatted: "0:38:05",
	timestamp: finishedTimestamp,
	timerState: "Finished",
	forfeit: false,
	results: [
		// 1着
		{
			raw: 1931,
			hours: 0,
			minutes: 32,
			seconds: 11,
			formatted: "0:32:11",
			timestamp: finishedTimestamp,
			timerState: "Finished",
			forfeit: false,
			place: 1,
		},
		// 2着
		{
			raw: 2142,
			hours: 0,
			minutes: 35,
			seconds: 42,
			formatted: "0:35:42",
			timestamp: finishedTimestamp,
			timerState: "Finished",
			forfeit: false,
			place: 2,
		},
		// 3着
		{
			raw: 2285,
			hours: 0,
			minutes: 38,
			seconds: 5,
			formatted: "0:38:05",
			timestamp: finishedTimestamp,
			timerState: "Finished",
			forfeit: false,
			place: 3,
		},
		// リタイア
		{
			raw: 1500,
			hours: 0,
			minutes: 25,
			seconds: 0,
			formatted: "0:25:00",
			timestamp: finishedTimestamp,
			timerState: "Stopped",
			forfeit: true,
		},
	],
};

// game.html?layout=X を撮るときの timer 状態セット。screenshot-graphics.ts は
// game-scene の全 layout についてこの2状態を撮影し、graphics/ 直下に
//   game--layout-<layout>-<label>.png
// として出力する。
export const gameSceneStates: Array<{
	label: string;
	timer: Record<string, unknown>;
}> = [
	{label: "start", timer: startTimer},
	{label: "finished", timer: finishedTimer},
];

const sampleNextRun = {
	pk: 101,
	index: 4,
	title: "次のサンプルゲーム",
	englishTitle: "Next Sample Game",
	category: "100%",
	platform: "PC",
	releaseYear: 2024,
	runDuration: "1:00:00",
	setupDuration: "0:10:00",
	camera: false,
	runners: [
		{pk: 3, name: "next_runner_1", twitch: "next_runner_1", camera: false},
	],
	commentators: [{name: "next_kaisetsu"}, null],
	twitchGameId: "0",
	completedChecklist: [],
};

const now = Date.now();

// 最終的にできあがるreplicant全体
export const fixtures: Record<string, unknown> = {
	"current-run": sampleRun,
	"next-run": sampleNextRun,
	schedule: [
		{...sampleRun, pk: 98, index: 1, title: "前の前のゲーム"},
		{...sampleRun, pk: 99, index: 2, title: "前のゲーム"},
		sampleRun,
		sampleNextRun,
		{
			...sampleNextRun,
			pk: 102,
			index: 5,
			title: "ラストのゲーム",
			englishTitle: "Last Sample Game",
		},
	],
	timer: startTimer,
	runners: ["speedy_taro", "ranner_jiro", "next_runner_1"],
	"camera-name": {title: "サンプルカメラ", name: "サンプルカメラ表示"},
	"camera-state": "small",
	checklist: [
		{pk: "ck-1", name: "ゲーム機の電源を入れる"},
		{pk: "ck-2", name: "OBS シーンを切り替える"},
		{pk: "ck-3", name: "音量を確認する"},
		{pk: "ck-4", name: "走者と打ち合わせする"},
	],
	countdown: {endTime: now + 600000, state: "stopped"},
	donations: [
		{
			pk: 1,
			name: "応援者A",
			amount: 1000,
			comment: "がんばってください！",
			featured: false,
		},
		{
			pk: 2,
			name: "応援者B",
			amount: 5000,
			comment: "応援しています、最高のラン期待しています！",
			featured: true,
		},
	],
	"donation-queue": [
		{
			pk: 3,
			name: "応援者C",
			amount: 2500,
			comment: "次のランも楽しみにしています。",
			featured: false,
		},
	],
	"donation-total": 123456,
	"bid-war": [
		{
			pk: 1,
			name: "次のキャラ選択",
			game: "サンプルゲーム デラックス",
			targets: [
				{pk: 11, name: "キャラA", total: 12000, percent: 60},
				{pk: 12, name: "キャラB", total: 8000, percent: 40},
			],
		},
	],
	"bid-challenge": [
		{
			pk: 1,
			name: "100%目標",
			game: "次のサンプルゲーム",
			goal: 50000,
			total: 32000,
			percent: 64,
		},
	],
	announcements: [
		{
			title: "サンプル告知",
			content: "次回イベントは○月○日開催予定です。",
		},
	],
	"playing-music": "Sample BGM - Sample Artist",
	"flash-warning": false,
	"video-control": null,
	"obs-status": {
		connected: false,
		stream: false,
		record: false,
		streamTime: 0,
		recordTime: 0,
	},
	tweets: [],
	"tweets-temp": [],
	"tweets-temp-images": [],
};

// -----------------------------------------------------
// package.jsonに定義している各パネル、画面の分の定義
// -----------------------------------------------------

// Dashboard
export const dashboardPanels: Array<{
	name: string;
	id: string;
	// Dashboard hash route that activates this panel. Regular panels live under
	// "workspace/<name>"; fullbleed panels live under "fullbleed/<name>".
	hash: string;
}> = [
	{name: "tech", id: "0-stream", hash: "fullbleed/0-stream"},
	{name: "spotify-auth", id: "spotify-auth", hash: "workspace/2-misc"},
	{name: "countdown", id: "countdown", hash: "workspace/2-misc"},
	{name: "camera", id: "camera", hash: "workspace/2-misc"},
	{name: "flash-warning", id: "flash-warning", hash: "workspace/2-misc"},
	{name: "credit-control", id: "credit-control", hash: "workspace/2-misc"},
	{name: "donations", id: "donations", hash: "workspace/3-reactions"},
	{name: "twitter", id: "twitter", hash: "workspace/3-reactions"},
	{name: "video-control", id: "video-control", hash: "workspace/2-misc"},
	{name: "announcements", id: "announcements", hash: "workspace/2-misc"},
];

// Graphics
export const graphics: Array<{
	file: string;
	width: number;
	height: number;
	variations?: string[];
}> = [
	{file: "break.html", width: 1920, height: 1030},
	{file: "game.html", width: 1920, height: 1030, variations: []},
	{file: "omnibar.html", width: 1920, height: 50},
	{file: "countdown.html", width: 1920, height: 1080},
	{file: "camera.html", width: 1920, height: 1080},
	{file: "credit.html", width: 1920, height: 1030},
	{file: "interval-video.html", width: 1920, height: 1080},
];
