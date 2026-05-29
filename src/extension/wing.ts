import net from "net";
import dgram from "dgram";
import {NodeCG} from "./nodecg";

/**
 * BEHRINGER WING と通信して audio activity を判定し `audio-active` replicant を
 * 更新する。実機 (fw 2.0) で検証した公式仕様 (WING Remote Protocols V3.1.0-3)
 * に基づく実装。
 *
 * 取得経路は 2 系統:
 *   1. マイク音量 (runners / commentators)
 *      TCP 2222 のネイティブ プロトコル channel 3 (Meter Data Requests) で
 *      対象 ch を subscribe し、UDP (meterRecvPort) に約 20Hz で届く
 *      バイナリ メーターパケットの input L/R を見る。閾値 + ヒステリシス + hold。
 *   2. ゲーム音 on-air (games)
 *      OSC 2223 で `/ch/<n>/main/<m>/{on,lvl}`, `/ch/<n>/$mute`, `/ch/<n>/$fdr`
 *      を起動時 dump + `/*S~` で変更購読し、配信 Main 送りが上がっているかで判定。
 *
 * 設定はすべて replicant で持つ (bundleConfig には依存しない):
 *   - audio-config     : 接続先 / ポート / 閾値 / 配信 Main bus
 *   - audio-assignment : current/next run の ch 割り当て (判定は current のみ)
 *   - audio-active     : runners/commentators/games の ON/OFF (nameplate が購読)
 *   - audio-status     : 接続状態
 *
 * audio-assignment の「次へ」繰り上げは schedule.ts の seekToNextRun() が行う。
 * wing.ts は audio-assignment.current を真として subscribe を張り替えるだけ。
 */

// ---- OSC ヘルパ -------------------------------------------------
const oscString = (str: string): Buffer => {
	const buf = Buffer.from(str + "\0");
	const pad = (4 - (buf.length % 4)) % 4;
	return Buffer.concat([buf, Buffer.alloc(pad)]);
};

// OSC 値読み取り / meta-command 送信用パケット (引数なし、タグは "," のみ)
const oscRead = (addr: string): Buffer =>
	Buffer.concat([oscString(addr), oscString(",")]);

type OscMessage = {addr: string; args: Array<number | string>};

// 受信 OSC メッセージのパース (単一メッセージ前提。bundle は未対応)
const parseOsc = (msg: Buffer): OscMessage | null => {
	if (msg.length < 4 || msg[0] !== 0x2f /* '/' */) return null;
	let i = 0;
	while (i < msg.length && msg[i] !== 0) i++;
	const addr = msg.toString("ascii", 0, i);
	i = (i + 4) & ~3;
	if (i >= msg.length || msg[i] !== 0x2c /* ',' */) return {addr, args: []};
	const tagStart = i;
	while (i < msg.length && msg[i] !== 0) i++;
	const tags = msg.toString("ascii", tagStart, i);
	i = (i + 4) & ~3;

	const args: Array<number | string> = [];
	for (let t = 1; t < tags.length; t++) {
		const tag = tags[t];
		if (tag === "f") {
			if (i + 4 > msg.length) break;
			args.push(msg.readFloatBE(i));
			i += 4;
		} else if (tag === "i") {
			if (i + 4 > msg.length) break;
			args.push(msg.readInt32BE(i));
			i += 4;
		} else if (tag === "s") {
			let j = i;
			while (j < msg.length && msg[j] !== 0) j++;
			args.push(msg.toString("ascii", i, j));
			i = (j + 4) & ~3;
		} else {
			break; // 未対応タグが来たら以降は読めない
		}
	}
	return {addr, args};
};

// ---- ネイティブ プロトコル (channel 3 = meters) ヘルパ ----------
// フレーム: 0xdf 0xd3 で channel 3 に切替。token は Table 4 (公式 p.94)。
const META = {
	channelSwitch3: () => Buffer.from([0xdf, 0xd3]),
};

const reqIdBytes = (id: number): Buffer =>
	Buffer.from([
		(id >> 24) & 0xff,
		(id >> 16) & 0xff,
		(id >> 8) & 0xff,
		id & 0xff,
	]);

// 受信ポート宣言: df d3 d3 <port hi> <port lo>
const buildDeclarePort = (port: number): Buffer =>
	Buffer.concat([
		META.channelSwitch3(),
		Buffer.from([0xd3, (port >> 8) & 0xff, port & 0xff]),
	]);

// メーター コレクション要求: df d3 d4 <reqid 4B> dc a0 <ch...> de
const buildSubscribe = (reqId: number, channels: number[]): Buffer => {
	const collection =
		channels.length > 0
			? Buffer.concat([
					Buffer.from([0xdc, 0xa0]),
					Buffer.from(channels),
					Buffer.from([0xde]),
			  ])
			: Buffer.alloc(0);
	return Buffer.concat([
		META.channelSwitch3(),
		Buffer.from([0xd4]),
		reqIdBytes(reqId),
		collection,
	]);
};

// renew (timeout 延長): df d3 d4 <reqid 4B>
const buildRenew = (reqId: number): Buffer =>
	Buffer.concat([
		META.channelSwitch3(),
		Buffer.from([0xd4]),
		reqIdBytes(reqId),
	]);

// メーターパケット parse。channel(0xa0) は 1 ch あたり 8 値。
//   uint32 report_id (BE) + int16[8 × N] (BE)、dBFS = value / 256
type ChannelMeter = {inputL: number; inputR: number};
const parseMeterPacket = (
	buf: Buffer,
	expectedReqId: number,
	channels: number[],
): Record<number, ChannelMeter> | null => {
	if (buf.length < 4) return null;
	if (buf.readUInt32BE(0) !== expectedReqId) return null;
	const result: Record<number, ChannelMeter> = {};
	let offset = 4;
	for (const ch of channels) {
		if (offset + 16 > buf.length) break;
		const inputL = buf.readInt16BE(offset) / 256;
		const inputR = buf.readInt16BE(offset + 2) / 256;
		offset += 16; // 8 values × 2 byte
		result[ch] = {inputL, inputR};
	}
	return result;
};

const REQ_ID = 2;

export const wing = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("wing");

	const configRep = nodecg.Replicant("audio-config");
	const assignmentRep = nodecg.Replicant("audio-assignment");
	const audioActiveRep = nodecg.Replicant("audio-active", {
		defaultValue: {runners: [], commentators: [], games: []},
	});
	const statusRep = nodecg.Replicant("audio-status");

	// --- 起動時リセット ---
	// 実行時状態 (active/status) は前回値が残ると誤表示の元なのでクリア。
	// 設定 (config/assignment) は永続値を維持する。
	audioActiveRep.value = {runners: [], commentators: [], games: []};
	statusRep.value = {state: "unconfigured", address: "", lastReceivedAt: null};

	let lastMeterRecv = 0;

	const setStatus = (
		state: "unconfigured" | "connecting" | "receiving",
		address: string,
	) => {
		const cur = statusRep.value;
		const lastReceivedAt = lastMeterRecv > 0 ? lastMeterRecv : null;
		if (
			cur &&
			cur.state === state &&
			cur.address === address &&
			cur.lastReceivedAt === lastReceivedAt
		) {
			return;
		}
		statusRep.value = {state, address, lastReceivedAt};
	};

	// ---- 判定用ステート ----
	type MicKind = "runners" | "commentators";
	const micKinds: MicKind[] = ["runners", "commentators"];

	// ch 番号 → 最新メーター / OSC 状態
	const meterState: Record<number, ChannelMeter> = {};
	type GameState = {
		mainOn: boolean;
		mainLvl: number;
		effMute: number;
		effFdr: number;
	};
	const oscState: Record<number, Partial<GameState>> = {};

	// mic ヒステリシス / hold (kind ごとに runner/commentator index で保持)
	const lastOver: Record<MicKind, number[]> = {runners: [], commentators: []};
	const micOn: Record<MicKind, boolean[]> = {runners: [], commentators: []};

	const currentAssignment = () =>
		assignmentRep.value?.current ?? {
			deck: null,
			runners: [] as number[],
			commentators: [] as number[],
			games: [] as number[],
		};

	// 監視対象マイク ch (runners ∪ commentators の正の値) を昇順ユニークで返す。
	// これが meter collection の subscribe 対象 & パース順になる。
	const micChannels = (): number[] => {
		const a = currentAssignment();
		const set = new Set<number>();
		for (const ch of [...a.runners, ...a.commentators]) {
			if (ch > 0) set.add(ch);
		}
		return [...set].sort((x, y) => x - y);
	};

	const gameChannels = (): number[] => {
		const set = new Set<number>();
		for (const ch of currentAssignment().games) if (ch > 0) set.add(ch);
		return [...set];
	};

	let subscribedChannels: number[] = [];

	// ---- active 再計算 ----
	const recomputeActive = () => {
		const cfg = configRep.value;
		const thresholdDb = cfg?.thresholdDb ?? -40;
		const hysteresisDb = cfg?.hysteresisDb ?? 3;
		const holdMs = cfg?.holdMs ?? 300;
		const mainSendThresholdDb = cfg?.mainSendThresholdDb ?? -60;
		const now = Date.now();
		const a = currentAssignment();

		// mic (runners / commentators): メーター + ヒステリシス + hold
		for (const kind of micKinds) {
			const channels = a[kind];
			if (micOn[kind].length !== channels.length) {
				micOn[kind] = Array(channels.length).fill(false);
				lastOver[kind] = Array(channels.length).fill(0);
			}
			channels.forEach((ch, idx) => {
				const m = ch > 0 ? meterState[ch] : undefined;
				const db = m ? Math.max(m.inputL, m.inputR) : -Infinity;
				if (micOn[kind][idx]) {
					if (db >= thresholdDb - hysteresisDb) {
						lastOver[kind][idx] = now;
					} else if (now - (lastOver[kind][idx] ?? 0) > holdMs) {
						micOn[kind][idx] = false;
					}
				} else if (db >= thresholdDb) {
					micOn[kind][idx] = true;
					lastOver[kind][idx] = now;
				}
			});
		}

		// games: OSC 由来の on-air 判定 (即時反映、hold 不要)
		const games = a.games.map((ch) => {
			if (ch <= 0) return false;
			const s = oscState[ch];
			if (!s) return false;
			return (
				s.mainOn === true &&
				(s.mainLvl ?? -Infinity) > mainSendThresholdDb &&
				s.effMute === 0 &&
				(s.effFdr ?? -Infinity) > mainSendThresholdDb
			);
		});

		audioActiveRep.value = {
			runners: [...micOn.runners],
			commentators: [...micOn.commentators],
			games,
		};
	};

	// ============ 接続マネージャ ============
	let tcp: net.Socket | null = null;
	let meterUdp: dgram.Socket | null = null;
	let oscUdp: dgram.Socket | null = null;
	let renewTimer: NodeJS.Timeout | null = null;
	let oscRenewTimer: NodeJS.Timeout | null = null;
	let watchdog: NodeJS.Timeout | null = null;
	let reconnectTimer: NodeJS.Timeout | null = null;
	let reconnectDelay = 1000;
	let currentKey = "";
	let generation = 0; // 接続世代。張り直し後の旧コールバックを無視するため

	const clearTimers = () => {
		for (const t of [renewTimer, oscRenewTimer, watchdog, reconnectTimer]) {
			if (t) clearInterval(t as NodeJS.Timeout);
		}
		renewTimer = oscRenewTimer = watchdog = reconnectTimer = null;
	};

	const teardown = () => {
		clearTimers();
		if (tcp) {
			tcp.removeAllListeners();
			tcp.destroy();
			tcp = null;
		}
		for (const s of [meterUdp, oscUdp]) {
			if (s) {
				try {
					s.removeAllListeners();
					s.close();
				} catch {
					/* noop */
				}
			}
		}
		meterUdp = oscUdp = null;
	};

	const cfgPorts = () => {
		const cfg = configRep.value;
		return {
			address: cfg?.address?.trim() ?? "",
			tcpPort: cfg?.tcpPort ?? 2222,
			oscPort: cfg?.oscPort ?? 2223,
			meterRecvPort: cfg?.meterRecvPort ?? 14135,
			streamingMainIndex: cfg?.streamingMainIndex ?? 1,
		};
	};

	// --- メーター subscribe (TCP) を現在の assignment に合わせて張り直す ---
	const sendMeterSubscribe = () => {
		if (!tcp || tcp.destroyed) return;
		subscribedChannels = micChannels();
		const {meterRecvPort} = cfgPorts();
		try {
			tcp.write(buildDeclarePort(meterRecvPort));
			tcp.write(buildSubscribe(REQ_ID, subscribedChannels));
			log.info(
				`Subscribed to meters for channels [${subscribedChannels.join(", ")}]`,
			);
		} catch (err) {
			log.debug(`meter subscribe write failed: ${(err as Error).message}`);
		}
	};

	// --- OSC: game ch の fader/mute を dump し、/*S~ で購読 ---
	const oscReadGameState = () => {
		if (!oscUdp) return;
		const {address, oscPort, streamingMainIndex} = cfgPorts();
		if (!address) return;
		const send = (addr: string) => {
			oscUdp?.send(oscRead(addr), oscPort, address, (err) => {
				if (err) log.debug(`OSC read failed (${addr}): ${err.message}`);
			});
		};
		for (const ch of gameChannels()) {
			send(`/ch/${ch}/main/${streamingMainIndex}/on`);
			send(`/ch/${ch}/main/${streamingMainIndex}/lvl`);
			send(`/ch/${ch}/$mute`);
			send(`/ch/${ch}/$fdr`);
		}
	};

	const oscSubscribeEvents = () => {
		if (!oscUdp) return;
		const {address, oscPort} = cfgPorts();
		if (!address) return;
		oscUdp.send(oscRead("/*S~"), oscPort, address, (err) => {
			if (err) log.debug(`OSC /*S~ failed: ${err.message}`);
		});
	};

	// OSC 受信メッセージを oscState に反映
	const handleOscMessage = (m: OscMessage) => {
		const {streamingMainIndex} = cfgPorts();
		// /ch/<n>/main/<m>/on | /lvl
		const mainMatch = /^\/ch\/(\d+)\/main\/(\d+)\/(on|lvl)$/.exec(m.addr);
		if (mainMatch) {
			const ch = Number(mainMatch[1]);
			const mainIdx = Number(mainMatch[2]);
			if (mainIdx !== streamingMainIndex) return;
			const v = m.args[0];
			if (typeof v !== "number") return;
			const s = (oscState[ch] ??= {});
			if (mainMatch[3] === "on") s.mainOn = v >= 0.5;
			else s.mainLvl = v;
			recomputeActive();
			return;
		}
		// /ch/<n>/$mute | /ch/<n>/$fdr
		const effMatch = /^\/ch\/(\d+)\/\$(mute|fdr)$/.exec(m.addr);
		if (effMatch) {
			const ch = Number(effMatch[1]);
			const v = m.args[0];
			if (typeof v !== "number") return;
			const s = (oscState[ch] ??= {});
			if (effMatch[2] === "mute") s.effMute = v;
			else s.effFdr = v;
			recomputeActive();
		}
	};

	const connect = () => {
		teardown();
		const {address, tcpPort, meterRecvPort} = cfgPorts();
		if (!address) {
			lastMeterRecv = 0;
			setStatus("unconfigured", "");
			log.info("WING address not set; waiting for dashboard input.");
			return;
		}

		const gen = ++generation;
		const alive = () => gen === generation;
		setStatus("connecting", address);

		// --- メーター UDP サーバ ---
		const mu = dgram.createSocket("udp4");
		meterUdp = mu;
		mu.on("message", (msg) => {
			if (!alive()) return;
			const parsed = parseMeterPacket(msg, REQ_ID, subscribedChannels);
			if (!parsed) return;
			lastMeterRecv = Date.now();
			Object.assign(meterState, parsed);
			setStatus("receiving", address);
			recomputeActive();
		});
		mu.on("error", (err) => log.warn(`meter UDP error: ${err.message}`));
		mu.bind(meterRecvPort, () => {
			if (alive()) log.info(`Meter UDP listening on :${meterRecvPort}`);
		});

		// --- OSC UDP ソケット ---
		const ou = dgram.createSocket("udp4");
		oscUdp = ou;
		ou.on("message", (msg) => {
			if (!alive()) return;
			const m = parseOsc(msg);
			if (m) handleOscMessage(m);
		});
		ou.on("error", (err) => log.warn(`OSC UDP error: ${err.message}`));
		ou.bind(0, () => {
			if (!alive()) return;
			oscReadGameState();
			oscSubscribeEvents();
			log.info("OSC subscription active");
		});

		// --- TCP コネクション (ネイティブ プロトコル) ---
		const sock = net.createConnection({host: address, port: tcpPort}, () => {
			if (!alive()) return;
			reconnectDelay = 1000;
			sendMeterSubscribe();
			// renew: meter は 5s timeout なので 3s 周期
			renewTimer = setInterval(() => {
				if (alive() && tcp && !tcp.destroyed) {
					try {
						tcp.write(buildRenew(REQ_ID));
					} catch {
						/* noop */
					}
				}
			}, 3000);
		});
		tcp = sock;

		sock.on("error", (err) => {
			if (alive()) log.warn(`TCP error: ${err.message}`);
		});
		sock.on("close", () => {
			if (!alive()) return;
			log.warn(`TCP closed; reconnecting in ${reconnectDelay}ms`);
			scheduleReconnect();
		});

		// --- OSC subscription renew (10s timeout → 8s 周期) ---
		oscRenewTimer = setInterval(() => {
			if (alive()) oscSubscribeEvents();
		}, 8000);

		// --- watchdog: メーターが 5s 途絶えたら connecting に戻し表示クリア ---
		watchdog = setInterval(() => {
			if (!alive()) return;
			if (lastMeterRecv > 0 && Date.now() - lastMeterRecv > 5000) {
				for (const k of micKinds) {
					micOn[k] = Array(currentAssignment()[k].length).fill(false);
				}
				recomputeActive();
				setStatus("connecting", address);
			}
		}, 2000);
	};

	const scheduleReconnect = () => {
		clearTimers();
		if (tcp) {
			tcp.removeAllListeners();
			tcp.destroy();
			tcp = null;
		}
		const delay = reconnectDelay;
		reconnectDelay = Math.min(reconnectDelay * 2, 16000);
		reconnectTimer = setTimeout(
			() => connect(),
			delay,
		) as unknown as NodeJS.Timeout;
	};

	// ---- assignment 変更で subscribe を張り替え ----
	assignmentRep.on("change", () => {
		// 監視 ch が変わったら meter subscribe と OSC read を更新
		for (const k of micKinds) {
			micOn[k] = Array(currentAssignment()[k].length).fill(false);
			lastOver[k] = Array(currentAssignment()[k].length).fill(0);
		}
		sendMeterSubscribe();
		oscReadGameState();
		recomputeActive();
	});

	// ---- config 変更で接続情報が変わったら張り直す ----
	const keyOf = () => {
		const {address, tcpPort, oscPort, meterRecvPort} = cfgPorts();
		return `${address}|${tcpPort}|${oscPort}|${meterRecvPort}`;
	};
	configRep.on("change", () => {
		const key = keyOf();
		if (key !== currentKey) {
			currentKey = key;
			connect();
		} else {
			// 閾値や streamingMainIndex だけの変更でも再計算
			oscReadGameState();
			recomputeActive();
		}
	});

	currentKey = keyOf();
	connect();
};
