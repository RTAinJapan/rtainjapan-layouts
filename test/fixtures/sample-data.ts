// Sample replicant data used by the screenshot regression harness.
// All shapes are aligned with /schemas/*.json — keep them in sync when the
// schemas evolve, otherwise NodeCG will silently reject the value during seed.

// game-scene のレイアウトは最大4人の runner を扱うので、サンプルは常に4人分。
// レイアウトが N 人用なら先頭 N 人だけ描画される（残りはコンテナが消費しない）。
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
	platform: "Switch",
	releaseYear: 2023,
	runDuration: "0:30:00",
	setupDuration: "0:05:00",
	camera: true,
	runners: sampleRunners,
	commentators: sampleCommentators,
	twitchGameId: "0",
	completedChecklist: [],
};

// 解説者数のバリエーション。default = 2人。
// game-scene の race-vertical / solo-split テンプレートが解説者を描画するので、
// それらを使うレイアウトでバリエーション撮影することで 0/1/2 人の表示確認に
// なる。
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
	timer: {
		raw: 754,
		hours: 0,
		minutes: 12,
		seconds: 34,
		formatted: "0:12:34",
		timestamp: now,
		timerState: "Running",
		forfeit: false,
		results: [null, null],
	},
	runners: ["speedy_taro", "ranner_jiro", "next_runner_1"],
	"camera-name": "サンプルカメラ表示",
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

// Dashboard panels. `id` is the panel name registered in package.json under
// nodecg.dashboardPanels (it forms the DOM id `<bundle>_<id>`). `workspace`
// matches the workspace the panel is registered under (the dashboard uses
// hash-based routing `#workspace/<name>` so we have to navigate explicitly).
// `name` is the label used for the output file name.
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

// Graphics defined in package.json's nodecg.graphics block.
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
