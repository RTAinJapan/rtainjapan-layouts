import dgram from "dgram";
import {NodeCG} from "./nodecg";

/**
 * BEHRINGER WING のメーター値を OSC で購読し、
 * runner ごとに「一定以上の音量か」を判定して
 * `audio-active` replicant (boolean[]) を更新する。
 *
 * 設定はすべて replicant で持ち、ダッシュボードパネルから編集する。
 *   - audio-config   : 接続先 IP / ポート / 閾値など
 *   - audio-assignment : current/next それぞれの「選択卓」と実 ch 割り当て。
 *                        判定には current.channels のみ使う。
 *   - audio-decks      : A卓/B卓ごとの ch 割り当てテンプレート（プルダウンの初期値）。
 *   - audio-meters   : 最新の全メーター値(dBFS)。ダッシュボードの ch 選択用。
 *   - audio-active   : runner ごとの ON/OFF。nameplate が購読して発光する。
 *
 * bundleConfig (cfg/*.json) には一切依存しない。
 */

// ---- OSC ヘルパ -------------------------------------------------
const oscString = (str: string): Buffer => {
	const buf = Buffer.from(str + "\0");
	const pad = (4 - (buf.length % 4)) % 4;
	return Buffer.concat([buf, Buffer.alloc(pad)]);
};

const oscInt = (n: number): Buffer => {
	const b = Buffer.alloc(4);
	b.writeInt32BE(n, 0);
	return b;
};

// ---- メーターブロブのパース -------------------------------------
// 形式: OSCアドレス + ",b"タグ + blob(4byte長 + データ)
// blob 先頭4byte(LE) = 後続 16bit整数の個数、以降 int16 LE が並ぶ。
// 値 / 256 = dBFS。
const parseMeterPacket = (msg: Buffer): number[] | null => {
	let i = 0;
	while (i < msg.length && msg[i] !== 0) i++;
	i = (i + 4) & ~3;

	const tagStart = i;
	while (i < msg.length && msg[i] !== 0) i++;
	const tags = msg.toString("ascii", tagStart, i);
	i = (i + 4) & ~3;

	if (!tags.includes("b")) return null;
	if (i + 4 > msg.length) return null;

	const blobByteLen = msg.readUInt32BE(i);
	i += 4;
	if (i + blobByteLen > msg.length) return null;

	const count = msg.readUInt32LE(i);
	let p = i + 4;

	const values: number[] = [];
	for (let k = 0; k < count; k++) {
		if (p + 2 > msg.length) break;
		values.push(msg.readInt16LE(p) / 256);
		p += 2;
	}
	return values;
};

export const wing = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("wing");

	const configRep = nodecg.Replicant("audio-config");
	const assignmentRep = nodecg.Replicant("audio-assignment");
	const currentRunRep = nodecg.Replicant("current-run");
	const audioActiveRep = nodecg.Replicant("audio-active", {defaultValue: []});
	const metersRep = nodecg.Replicant("audio-meters", {defaultValue: []});
	const statusRep = nodecg.Replicant("audio-status");

	// --- 起動時リセット ---
	// replicant は永続化され、前回起動時の値が復元される。
	// 実行時の状態を表す replicant は、前回イベントの値が残っていると
	// WING 接続前に nameplate が光ったり「疎通OK」と誤表示されたりするので、
	// 起動時に必ずクリアする。
	//   audio-active : 前回 [true,...] のまま終了→起動直後に誤発光
	//   audio-meters : 前回のレベルが残る→未接続なのに古いバーが出る
	//   audio-status : 前回 receiving のまま終了→未接続なのに緑表示
	// 一方、audio-config / audio-assignment / audio-decks は「設定」なので残す。
	audioActiveRep.value = [];
	metersRep.value = [];
	statusRep.value = {
		state: "unconfigured",
		address: "",
		lastReceivedAt: null,
	};

	let lastRecvTime = 0; // 最後にWINGからパケットを受けた時刻（watchdog/status用）

	// ステータス更新ヘルパ（差分があるときだけ書く）
	const setStatus = (
		state: "unconfigured" | "connecting" | "receiving",
		address: string,
	) => {
		const cur = statusRep.value;
		if (
			cur &&
			cur.state === state &&
			cur.address === address &&
			cur.lastReceivedAt === (lastRecvTime > 0 ? lastRecvTime : null)
		) {
			return;
		}
		statusRep.value = {
			state,
			address,
			lastReceivedAt: lastRecvTime > 0 ? lastRecvTime : null,
		};
	};

	// runner ごとの内部状態
	let lastOver: number[] = [];
	let state: boolean[] = [];

	// マッピング変更時は状態を完全リセット（前の点灯を引き継がない）
	const resetState = (len: number) => {
		lastOver = Array(len).fill(0);
		state = Array(len).fill(false);
		audioActiveRep.value = [...state];
	};

	// 発光判定に使うのは current の卓のチャンネル割り当てだけ
	// （画面に出ているのは current のため）。
	const currentChannels = (): number[] =>
		assignmentRep.value?.current?.channels ?? [];

	resetState(currentChannels().length);
	// current の割り当てが変わったら状態をリセット（前の点灯を引き継がない）
	assignmentRep.on("change", (newVal) => {
		resetState(newVal?.current?.channels?.length ?? 0);
	});

	// --- 「次へ」で run が進んだら ch 割り当てを繰り上げる ---
	// ダッシュボードの「次へ」は next→current コピー（schedule.ts: seekToNextRun）。
	// 運用上 current/next は別々の卓を使うので、それに追従して
	// next の割り当てを current に繰り上げ、next を空にする。
	// index が +1 されたとき（=次へ）だけ繰り上げる。前へ/任意ジャンプでは
	// 自動追従しないので、その場合はパネルで卓を選び直す。
	let lastRunIndex: number | null = currentRunRep.value?.index ?? null;
	currentRunRep.on("change", (newRun) => {
		const newIndex = newRun?.index ?? null;
		const prevIndex = lastRunIndex;
		lastRunIndex = newIndex;

		if (
			prevIndex == null ||
			newIndex == null ||
			newIndex !== prevIndex + 1
		) {
			return; // 「次へ」以外（初期化・前へ・ジャンプ）は追従しない
		}

		const asg = assignmentRep.value;
		const promoted = asg?.next ?? {deck: null, channels: []};
		assignmentRep.value = {
			current: {
				deck: promoted.deck ?? null,
				channels: [...(promoted.channels ?? [])],
			},
			next: {deck: null, channels: []},
		};
		log.info(
			`Run advanced (#${prevIndex}->#${newIndex}); promoted next deck "${
				promoted.deck ?? "none"
			}" to current.`,
		);
	});

	let lastMeterPush = 0;
	const METER_PUSH_INTERVAL = 100; // ms

	const evaluate = (values: number[]) => {
		const now = Date.now();
		const cfg = configRep.value;
		const thresholdDb = cfg?.thresholdDb ?? -40;
		const hysteresisDb = cfg?.hysteresisDb ?? 3;
		const holdMs = cfg?.holdMs ?? 300;
		const channels = currentChannels();

		if (state.length !== channels.length) resetState(channels.length);

		let changed = false;
		channels.forEach((meterIdx, runnerIdx) => {
			if (meterIdx < 0 || meterIdx >= values.length) {
				if (state[runnerIdx]) {
					state[runnerIdx] = false;
					changed = true;
				}
				return;
			}
			const db = values[meterIdx];

			if (state[runnerIdx]) {
				if (db >= thresholdDb - hysteresisDb) {
					lastOver[runnerIdx] = now;
				} else if (now - lastOver[runnerIdx] > holdMs) {
					state[runnerIdx] = false;
					changed = true;
				}
			} else {
				if (db >= thresholdDb) {
					state[runnerIdx] = true;
					lastOver[runnerIdx] = now;
					changed = true;
				}
			}
		});

		if (changed) audioActiveRep.value = [...state];

		if (now - lastMeterPush > METER_PUSH_INTERVAL) {
			lastMeterPush = now;
			metersRep.value = values.map((v) => Math.round(v * 10) / 10);
		}
	};

	// ---- 接続管理（IP/ポート/metersId が変わったら張り直す） ----
	let udp: dgram.Socket | null = null;
	let keepAlive: NodeJS.Timeout | null = null;
	let currentKey = ""; // address|port|metersId

	const teardown = () => {
		if (keepAlive) {
			clearInterval(keepAlive);
			keepAlive = null;
		}
		if (udp) {
			try {
				udp.close();
			} catch {
				/* noop */
			}
			udp = null;
		}
	};

	const connect = () => {
		const cfg = configRep.value;
		const address = cfg?.address?.trim();
		const port = cfg?.port ?? 2223;
		const metersId = cfg?.metersId ?? 1;

		teardown();

		if (!address) {
			lastRecvTime = 0;
			setStatus("unconfigured", "");
			log.info("WING address not set; waiting for dashboard input.");
			return;
		}

		const sock = dgram.createSocket("udp4");
		udp = sock;
		lastRecvTime = 0;
		let currentInterval = 0;

		sock.on("message", (msg) => {
			const values = parseMeterPacket(msg);
			if (values) {
				lastRecvTime = Date.now();
				setStatus("receiving", address);
				evaluate(values);
			}
		});

		// WING が落ちている間の ICMP port unreachable などで error が出ても、
		// ソケットは破棄せず保持する。意図しない close のときだけ作り直す。
		sock.on("error", (err) => {
			log.warn(`UDP error (keep retrying): ${err.message}`);
		});
		sock.on("close", () => {
			if (udp === sock) {
				log.warn("UDP socket closed unexpectedly; reconnecting.");
				udp = null;
				connect();
			}
		});

		const sendSubscribe = () => {
			if (udp !== sock) return; // 既に張り直されていたら無視
			const req = Buffer.concat([
				oscString("/meters"),
				oscString(",si"),
				oscString(`/meters/${metersId}`),
				oscInt(0),
			]);
			sock.send(req, port, address, (err) => {
				// 送信失敗（相手不在など）はログのみ。ソケットは保持し再送し続ける。
				if (err) log.debug(`subscribe send failed: ${err.message}`);
			});
		};

		// keep-alive 兼リトライ。
		// WING サブスクリプションは約10秒で失効するので、受信中は 5 秒間隔で更新。
		// まだ受信できていない/途絶えたときは 2 秒間隔で粘り続ける。
		// これにより「NodeCG 起動後に WING を起動」「WING 再起動」「瞬断」のいずれも
		// 自動で復帰する。
		const tick = () => {
			if (udp !== sock) return;
			const now = Date.now();
			const receiving = lastRecvTime > 0 && now - lastRecvTime < 5000;

			sendSubscribe();

			// watchdog: 一度受信したのに 5 秒以上途絶えたら表示をクリア
			if (lastRecvTime > 0 && now - lastRecvTime > 5000) {
				if (metersRep.value && metersRep.value.length > 0) {
					metersRep.value = [];
				}
				if (audioActiveRep.value.some((v) => v)) {
					resetState(currentChannels().length);
				}
				// 受信が途絶えたので「接続待ち」に戻す
				// （lastReceivedAt は最後に受けた時刻として残す）
				setStatus("connecting", address);
			}

			// 受信状況に応じて間隔を切り替える
			const desired = receiving ? 5000 : 2000;
			if (currentInterval !== desired) {
				currentInterval = desired;
				if (keepAlive) clearInterval(keepAlive);
				keepAlive = setInterval(tick, desired);
			}
		};

		sock.bind(0, () => {
			log.info(
				`Subscribing to WING meters at ${address}:${port} (/meters/${metersId})`,
			);
			setStatus("connecting", address);
			sendSubscribe();
			currentInterval = 2000;
			keepAlive = setInterval(tick, currentInterval);
		});
	};

	// 設定が変わったら、接続に関わる項目だけ差分を見て張り直す
	configRep.on("change", (newVal) => {
		const key = `${newVal?.address ?? ""}|${newVal?.port ?? 2223}|${
			newVal?.metersId ?? 1
		}`;
		if (key !== currentKey) {
			currentKey = key;
			connect();
		}
	});

	// 起動時に一度接続を試みる
	currentKey = `${configRep.value?.address ?? ""}|${
		configRep.value?.port ?? 2223
	}|${configRep.value?.metersId ?? 1}`;
	connect();
};
