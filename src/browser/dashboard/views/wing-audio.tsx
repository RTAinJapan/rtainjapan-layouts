import "../styles/global";

import {useState, useEffect} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {useReplicant} from "../../use-replicant";
import {render} from "../../render";

// このパネルは「大会開始前に1回だけ設定して放置」する内容に限定する。
//   - WING 接続情報 (IP / ポート / 閾値 / 配信 Main bus)
//   - 卓 (A/B) テンプレートのデフォルト ch
// 各 run の卓選択・走者/解説 ch 入力は配信担当ダッシュボード (tech) の
// 「編集：現在/次のゲーム」モーダル側で行う (schedule/edit.tsx の AudioSection)。

const configRep = nodecg.Replicant("audio-config");

const labelStyle: React.CSSProperties = {
	fontSize: 12,
	opacity: 0.7,
	display: "block",
	marginBottom: 2,
};

const ConnectionSettings = () => {
	const config = useReplicant("audio-config");
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

	const update = (patch: Partial<NonNullable<typeof config>>) => {
		configRep.value = {...(config ?? {}), ...patch};
	};

	const numInput = (
		label: string,
		value: number,
		fallback: number,
		onValue: (n: number) => void,
		parse: (s: string) => number = (s) => parseInt(s, 10),
	) => (
		<div>
			<label style={labelStyle}>{label}</label>
			<input
				type='number'
				value={value}
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
					value={config?.address ?? ""}
					style={{width: "100%"}}
					onChange={(e) => update({address: e.currentTarget.value})}
				/>
			</div>
			{numInput("TCP ポート", config?.tcpPort ?? 2222, 2222, (n) =>
				update({tcpPort: n}),
			)}
			{numInput("OSC ポート", config?.oscPort ?? 2223, 2223, (n) =>
				update({oscPort: n}),
			)}

			{numInput("受信ポート", config?.meterRecvPort ?? 14135, 14135, (n) =>
				update({meterRecvPort: n}),
			)}
			<div>
				<label style={labelStyle}>配信用 Main bus</label>
				<select
					value={config?.streamingMainIndex ?? 1}
					style={{width: "100%"}}
					onChange={(e) =>
						update({
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
				config?.thresholdDb ?? -40,
				-40,
				(n) => update({thresholdDb: n}),
				parseFloat,
			)}
			{numInput(
				"ヒステリシス",
				config?.hysteresisDb ?? 3,
				3,
				(n) => update({hysteresisDb: n}),
				parseFloat,
			)}
			{numInput("hold (ms)", config?.holdMs ?? 300, 300, (n) =>
				update({holdMs: n}),
			)}

			{numInput(
				"閾値 game (dB)",
				config?.mainSendThresholdDb ?? -60,
				-60,
				(n) => update({mainSendThresholdDb: n}),
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

// 卓テンプレートの編集（モーダルで卓を選んだときに流し込む初期値）
const DeckTemplates = () => {
	const config = useReplicant("audio-config");
	const decks = config?.decks;

	const parseCsv = (csv: string): number[] =>
		csv
			.split(",")
			.map((s) => parseInt(s.trim(), 10))
			.filter((n) => !Number.isNaN(n));

	const setTemplate = (
		d: "A" | "B",
		kind: "runners" | "commentators" | "games",
		csv: string,
	) => {
		const cur = decks?.[d] ?? {runners: [], commentators: [], games: []};
		configRep.value = {
			...(config ?? {}),
			decks: {...(decks ?? {}), [d]: {...cur, [kind]: parseCsv(csv)}},
		};
	};

	const fmt = (arr?: number[]) => (arr ?? []).join(", ");

	const rows: Array<{
		kind: "runners" | "commentators" | "games";
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
				卓テンプレート（デフォルト初期値）
			</summary>
			<div style={{marginTop: 8, fontSize: 12, opacity: 0.7}}>
				走者・解説のマイク ch とゲーム音 ch を WING channel-strip 番号 (1..40)
				でカンマ区切り入力。モーダルで卓を選ぶとこの値が流し込まれる。
			</div>
			{(["A", "B"] as const).map((d) => (
				<div key={d} style={{marginTop: 6}}>
					<label style={labelStyle}>{d}卓テンプレート</label>
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
									defaultValue={fmt(decks?.[d]?.[r.kind])}
									placeholder={r.placeholder}
									style={{width: "100%"}}
									onBlur={(e) => setTemplate(d, r.kind, e.currentTarget.value)}
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
	return (
		<div style={{padding: 12, fontFamily: "sans-serif"}}>
			<ConnectionSettings />
			<DeckTemplates />
		</div>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
