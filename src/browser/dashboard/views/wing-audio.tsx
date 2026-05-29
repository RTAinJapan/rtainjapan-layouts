import "../styles/global";

import {useState, useEffect} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import {useReplicant} from "../../use-replicant";
import {render} from "../../render";
import type {AudioConfig} from "../../../nodecg/generated/audio-config";

// このパネルは「大会開始前に1回だけ設定して放置」する内容に限定する。
//   - WING 接続情報 (IP / ポート / 閾値 / 配信 Main bus)
//   - 卓 (A/B) プリセットのデフォルト ch
// 各 run の卓選択・走者/解説 ch 入力は配信担当ダッシュボード (tech) の
// 「編集：現在/次のゲーム」モーダル側で行う (schedule/edit.tsx)。
//
// イベント中の誤操作で設定を書き換えないよう、鉛筆アイコンで編集開始 →
// チェックで確定 (replicant 反映) / Undo で破棄、という編集ロックを設ける。
// 編集中の入力はすべてローカルのドラフトに溜め、確定時のみ audio-config へ書く。

const configRep = nodecg.Replicant("audio-config");

const labelStyle: React.CSSProperties = {
	fontSize: 12,
	opacity: 0.7,
	display: "block",
	marginBottom: 2,
};

const fmtCsv = (arr?: number[]) => (arr ?? []).join(", ");
const parseCsv = (csv: string): number[] =>
	csv
		.split(",")
		.map((s) => parseInt(s.trim(), 10))
		.filter((n) => !Number.isNaN(n));

type DeckText = {runners: string; commentators: string; games: string};
type DecksText = {A: DeckText; B: DeckText};

const decksToText = (decks?: AudioConfig["decks"]): DecksText => ({
	A: {
		runners: fmtCsv(decks?.A?.runners),
		commentators: fmtCsv(decks?.A?.commentators),
		games: fmtCsv(decks?.A?.games),
	},
	B: {
		runners: fmtCsv(decks?.B?.runners),
		commentators: fmtCsv(decks?.B?.commentators),
		games: fmtCsv(decks?.B?.games),
	},
});

const ConnectionSettings = ({
	value,
	edit,
	onPatch,
}: {
	value: AudioConfig;
	edit: boolean;
	onPatch: (patch: Partial<AudioConfig>) => void;
}) => {
	const status = useReplicant("audio-status");

	// 「最終受信から何秒」を動かすため1秒ごとに再描画
	const [now, setNow] = useState(Date.now());
	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	const state = status?.state ?? "unconfigured";
	const lastAt = status?.lastReceivedAt ?? null;
	const sinceSec = lastAt != null ? Math.floor((now - lastAt) / 1000) : null;

	const indicator =
		state === "receiving"
			? {color: "#22c55e", label: "疎通OK（メーター受信中）"}
			: state === "connecting"
			? {color: "#f59e0b", label: "接続待ち（応答なし）"}
			: {color: "#9ca3af", label: "未設定"};

	const numInput = (
		label: string,
		val: number,
		fallback: number,
		onValue: (n: number) => void,
		parse: (s: string) => number = (s) => parseInt(s, 10),
	) => (
		<div>
			<label style={labelStyle}>{label}</label>
			<input
				type='number'
				value={val}
				disabled={!edit}
				style={{width: "100%"}}
				onChange={(e) => {
					const n = parse(e.currentTarget.value);
					onValue(Number.isNaN(n) ? fallback : n);
				}}
			/>
		</div>
	);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 90px 90px",
				gap: 8,
				alignItems: "end",
				marginBottom: 12,
				paddingBottom: 12,
				borderBottom: "1px solid #2a2e36",
			}}
		>
			<div>
				<label style={labelStyle}>WING IP アドレス</label>
				<input
					type='text'
					placeholder='192.168.x.x'
					value={value.address ?? ""}
					disabled={!edit}
					style={{width: "100%"}}
					onChange={(e) => onPatch({address: e.currentTarget.value})}
				/>
			</div>
			{numInput("TCP ポート", value.tcpPort ?? 2222, 2222, (n) =>
				onPatch({tcpPort: n}),
			)}
			{numInput("OSC ポート", value.oscPort ?? 2223, 2223, (n) =>
				onPatch({oscPort: n}),
			)}

			{numInput("受信ポート", value.meterRecvPort ?? 14135, 14135, (n) =>
				onPatch({meterRecvPort: n}),
			)}
			<div>
				<label style={labelStyle}>配信用 Main bus</label>
				<select
					value={value.streamingMainIndex ?? 1}
					disabled={!edit}
					style={{width: "100%"}}
					onChange={(e) =>
						onPatch({
							streamingMainIndex: parseInt(e.currentTarget.value, 10) || 1,
						})
					}
				>
					{[1, 2, 3, 4].map((m) => (
						<option key={m} value={m}>
							Main {m}
						</option>
					))}
				</select>
			</div>
			<div />

			{numInput(
				"閾値 mic (dBFS)",
				value.thresholdDb ?? -40,
				-40,
				(n) => onPatch({thresholdDb: n}),
				parseFloat,
			)}
			{numInput(
				"ヒステリシス",
				value.hysteresisDb ?? 3,
				3,
				(n) => onPatch({hysteresisDb: n}),
				parseFloat,
			)}
			{numInput("hold (ms)", value.holdMs ?? 300, 300, (n) =>
				onPatch({holdMs: n}),
			)}

			{numInput(
				"閾値 game (dB)",
				value.mainSendThresholdDb ?? -60,
				-60,
				(n) => onPatch({mainSendThresholdDb: n}),
				parseFloat,
			)}
			<div style={{gridColumn: "2 / 4"}} />

			<div
				style={{
					gridColumn: "1 / 4",
					fontSize: 12,
					display: "flex",
					alignItems: "center",
					gap: 8,
				}}
			>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: indicator.color,
						boxShadow:
							state === "receiving" ? `0 0 6px ${indicator.color}` : "none",
						display: "inline-block",
						flexShrink: 0,
					}}
				/>
				<span style={{color: indicator.color}}>{indicator.label}</span>
				{state !== "unconfigured" && sinceSec != null && (
					<span style={{opacity: 0.6}}>
						最終受信 {sinceSec === 0 ? "たった今" : `${sinceSec}秒前`}
					</span>
				)}
				{state === "connecting" && lastAt == null && (
					<span style={{opacity: 0.6}}>まだ一度も受信していません</span>
				)}
			</div>
		</div>
	);
};

// 卓 (A/B) プリセットの編集。編集中は decksText(文字列バッファ)を表示、
// 非編集中は replicant の値をそのまま表示する。
const DeckTemplates = ({
	readDecks,
	decksText,
	edit,
	onText,
}: {
	readDecks: AudioConfig["decks"];
	decksText: DecksText;
	edit: boolean;
	onText: (d: "A" | "B", kind: keyof DeckText, value: string) => void;
}) => {
	const rows: Array<{
		kind: keyof DeckText;
		label: string;
		placeholder: string;
	}> = [
		{kind: "runners", label: "走者", placeholder: "1, 2, 3, 4"},
		{kind: "commentators", label: "解説", placeholder: "5, 6"},
		{kind: "games", label: "ゲーム音", placeholder: "9, 11, 13, 15"},
	];

	return (
		<details style={{marginTop: 6}} open>
			<summary style={{cursor: "pointer", fontSize: 13, opacity: 0.7}}>
				卓プリセット（デフォルト初期値）
			</summary>
			<div style={{marginTop: 8, fontSize: 12, opacity: 0.7}}>
				走者・解説のマイク ch とゲーム音 ch を WING channel-strip 番号 (1..40)
				でカンマ区切り入力。モーダルで卓を選ぶとこの値が流し込まれる。
			</div>
			{(["A", "B"] as const).map((d) => (
				<div key={d} style={{marginTop: 6}}>
					<label style={labelStyle}>{d}卓プリセット</label>
					<div
						style={{display: "grid", gridTemplateColumns: "60px 1fr", gap: 6}}
					>
						{rows.map((r) => (
							<div key={r.kind} style={{display: "contents"}}>
								<div style={{fontSize: 11, opacity: 0.6, alignSelf: "center"}}>
									{r.label}
								</div>
								<input
									type='text'
									value={
										edit
											? decksText[d][r.kind]
											: fmtCsv(readDecks?.[d]?.[r.kind])
									}
									disabled={!edit}
									placeholder={r.placeholder}
									style={{width: "100%"}}
									onChange={(e) => onText(d, r.kind, e.currentTarget.value)}
								/>
							</div>
						))}
					</div>
				</div>
			))}
		</details>
	);
};

const App = () => {
	const config = useReplicant("audio-config");
	const [edit, setEdit] = useState(false);
	const [draft, setDraft] = useState<AudioConfig>({});
	const [decksText, setDecksText] = useState<DecksText>(decksToText());

	// 非編集中は replicant の最新値をドラフトに同期する。
	// 編集中は外部更新でドラフトを上書きしない。
	useEffect(() => {
		if (!edit) {
			setDraft(config ?? {});
			setDecksText(decksToText(config?.decks));
		}
	}, [config, edit]);

	const patch = (p: Partial<AudioConfig>) => setDraft((d) => ({...d, ...p}));
	const setText = (d: "A" | "B", kind: keyof DeckText, value: string) =>
		setDecksText((t) => ({...t, [d]: {...t[d], [kind]: value}}));

	const confirm = () => {
		configRep.value = {
			...draft,
			decks: {
				A: {
					runners: parseCsv(decksText.A.runners),
					commentators: parseCsv(decksText.A.commentators),
					games: parseCsv(decksText.A.games),
				},
				B: {
					runners: parseCsv(decksText.B.runners),
					commentators: parseCsv(decksText.B.commentators),
					games: parseCsv(decksText.B.games),
				},
			},
		};
		setEdit(false);
	};

	const cancel = () => {
		setDraft(config ?? {});
		setDecksText(decksToText(config?.decks));
		setEdit(false);
	};

	const value = edit ? draft : config ?? {};

	return (
		<div style={{padding: 12, fontFamily: "sans-serif"}}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					marginBottom: 8,
				}}
			>
				<strong style={{fontSize: 14}}>WING 設定</strong>
				<span style={{fontSize: 12, opacity: 0.6}}>
					{edit ? "編集中（確定で反映）" : "ロック中（鉛筆で編集）"}
				</span>
				<span style={{marginLeft: "auto"}} />
				{edit ? (
					<>
						<IconButton size='small' title='確定' onClick={confirm}>
							<CheckIcon />
						</IconButton>
						<IconButton size='small' title='取消' onClick={cancel}>
							<UndoIcon />
						</IconButton>
					</>
				) : (
					<IconButton size='small' title='編集' onClick={() => setEdit(true)}>
						<EditIcon />
					</IconButton>
				)}
			</div>
			<ConnectionSettings value={value} edit={edit} onPatch={patch} />
			<DeckTemplates
				readDecks={config?.decks}
				decksText={decksText}
				edit={edit}
				onText={setText}
			/>
		</div>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
