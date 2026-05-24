import "../styles/global";

import {useState, useEffect} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {useReplicant} from "../../use-replicant";
import {render} from "../../render";

const assignmentRep = nodecg.Replicant("audio-assignment");
const decksRep = nodecg.Replicant("audio-decks");
const configRep = nodecg.Replicant("audio-config");

// dBFS をバーの幅(%)に変換（-60dB〜0dB を 0〜100% に）
const dbToPercent = (db: number) => {
	const min = -60;
	const pct = ((db - min) / (0 - min)) * 100;
	return Math.max(0, Math.min(100, pct));
};

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
			<div>
				<label style={labelStyle}>ポート</label>
				<input
					type='number'
					value={config?.port ?? 2223}
					style={{width: "100%"}}
					onChange={(e) =>
						update({port: parseInt(e.currentTarget.value, 10) || 2223})
					}
				/>
			</div>
			<div>
				<label style={labelStyle}>meters ID</label>
				<input
					type='number'
					value={config?.metersId ?? 1}
					style={{width: "100%"}}
					onChange={(e) =>
						update({metersId: parseInt(e.currentTarget.value, 10) || 1})
					}
				/>
			</div>

			<div>
				<label style={labelStyle}>閾値 (dBFS)</label>
				<input
					type='number'
					value={config?.thresholdDb ?? -40}
					style={{width: "100%"}}
					onChange={(e) =>
						update({thresholdDb: parseFloat(e.currentTarget.value) || -40})
					}
				/>
			</div>
			<div>
				<label style={labelStyle}>ヒステリシス</label>
				<input
					type='number'
					value={config?.hysteresisDb ?? 3}
					style={{width: "100%"}}
					onChange={(e) =>
						update({hysteresisDb: parseFloat(e.currentTarget.value) || 0})
					}
				/>
			</div>
			<div>
				<label style={labelStyle}>hold (ms)</label>
				<input
					type='number'
					value={config?.holdMs ?? 300}
					style={{width: "100%"}}
					onChange={(e) =>
						update({holdMs: parseInt(e.currentTarget.value, 10) || 0})
					}
				/>
			</div>

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

// 1人分の行（名前・ch入力・レベルバー）。走者にも解説にも使う。
const PersonRow = ({
	name,
	assigned,
	level,
	onChange,
}: {
	name: string;
	assigned: number;
	level: number | null;
	onChange: (v: number) => void;
}) => (
	<div
		style={{
			display: "grid",
			gridTemplateColumns: "120px 70px 1fr 56px",
			gap: 8,
			alignItems: "center",
			padding: "5px 0",
			borderBottom: "1px solid #2a2e36",
		}}
	>
		<div
			style={{
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			}}
			title={name}
		>
			{name}
		</div>
		<input
			type='number'
			value={assigned}
			min={-1}
			style={{width: 60}}
			onChange={(e) => onChange(parseInt(e.currentTarget.value, 10) || -1)}
		/>
		<div
			style={{
				height: 13,
				background: "#23272f",
				borderRadius: 4,
				position: "relative",
				overflow: "hidden",
			}}
		>
			{level != null && (
				<div
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						bottom: 0,
						width: `${dbToPercent(level)}%`,
						background: level >= -40 ? "#22c55e" : "#3b82f6",
						transition: "width 0.1s linear",
					}}
				/>
			)}
		</div>
		<div
			style={{
				textAlign: "right",
				fontVariantNumeric: "tabular-nums",
				fontSize: 12,
			}}
		>
			{level == null ? "—" : level.toFixed(1)}
		</div>
	</div>
);

// current か next いずれかの卓割り当てセクション。
// 走者と解説で別々に ch を持つので2つのテーブルを出す。
const DeckSection = ({
	slot,
	title,
	highlight,
}: {
	slot: "current" | "next";
	title: string;
	highlight: boolean;
}) => {
	const assignment = useReplicant("audio-assignment");
	const decks = useReplicant("audio-decks");
	const currentRun = useReplicant("current-run");
	const nextRun = useReplicant("next-run");
	const meters = useReplicant("audio-meters") ?? [];

	const run = slot === "current" ? currentRun : nextRun;
	const runners = run?.runners ?? [];
	const commentators: {name?: string}[] = (run?.commentators ?? []).flatMap(
		(c) => (c ? [c] : []),
	);
	const slotData = assignment?.[slot] ?? {
		deck: null,
		runners: [],
		commentators: [],
	};
	const deck = slotData.deck ?? null;
	const runnerCh = slotData.runners ?? [];
	const commentatorCh = slotData.commentators ?? [];

	const writeSlot = (patch: {
		deck?: "A" | "B" | null;
		runners?: number[];
		commentators?: number[];
	}) => {
		const cur = assignment ?? {};
		const base = cur[slot] ?? {deck: null, runners: [], commentators: []};
		assignmentRep.value = {
			...cur,
			[slot]: {...base, ...patch},
		};
	};

	// 卓を選ぶとテンプレートを channels に流し込む（人数に合わせて埋める）
	const selectDeck = (d: "A" | "B" | "") => {
		if (d === "") {
			writeSlot({deck: null});
			return;
		}
		const tmpl = decks?.[d] ?? {runners: [], commentators: []};
		const fillRunners: number[] = [];
		for (let i = 0; i < runners.length; i++) {
			fillRunners[i] = tmpl.runners?.[i] ?? -1;
		}
		const fillCommentators: number[] = [];
		for (let i = 0; i < commentators.length; i++) {
			fillCommentators[i] = tmpl.commentators?.[i] ?? -1;
		}
		writeSlot({
			deck: d,
			runners: fillRunners,
			commentators: fillCommentators,
		});
	};

	const setChannel = (
		kind: "runners" | "commentators",
		idx: number,
		meterIdx: number,
	) => {
		const len = (kind === "runners" ? runners : commentators).length;
		const cur = kind === "runners" ? runnerCh : commentatorCh;
		const next: number[] = [];
		for (let i = 0; i < len; i++) next[i] = cur[i] ?? -1;
		next[idx] = meterIdx;
		writeSlot({[kind]: next});
	};

	const renderSection = (
		label: string,
		people: {name?: string}[],
		channels: number[],
		kind: "runners" | "commentators",
	) => (
		<div style={{marginTop: 6}}>
			<div style={{fontSize: 11, opacity: 0.6, marginBottom: 2}}>{label}</div>
			{people.length === 0 ? (
				<div style={{opacity: 0.5, fontSize: 12, padding: "4px 0"}}>
					（不在）
				</div>
			) : (
				people.map((p, i) => {
					const a = channels[i] ?? -1;
					const level = a >= 0 && a < meters.length ? meters[a] ?? null : null;
					return (
						<PersonRow
							key={i}
							name={p?.name || `(${kind} ${i})`}
							assigned={a}
							level={level}
							onChange={(v) => setChannel(kind, i, v)}
						/>
					);
				})
			)}
		</div>
	);

	return (
		<div
			style={{
				border: highlight ? "1px solid #00BEBE" : "1px solid #2a2e36",
				borderRadius: 8,
				padding: 10,
				marginBottom: 10,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10,
					marginBottom: 8,
				}}
			>
				<strong style={{fontSize: 14}}>{title}</strong>
				{highlight && (
					<span style={{fontSize: 11, color: "#00BEBE"}}>
						● 画面に表示中（発光対象）
					</span>
				)}
				<span style={{marginLeft: "auto", fontSize: 12, opacity: 0.7}}>
					卓:
				</span>
				<select
					value={deck ?? ""}
					onChange={(e) => selectDeck(e.currentTarget.value as "A" | "B" | "")}
				>
					<option value=''>（未選択）</option>
					<option value='A'>A卓</option>
					<option value='B'>B卓</option>
				</select>
			</div>

			{!run?.pk ? (
				<div style={{opacity: 0.6, fontSize: 13}}>
					{slot === "current"
						? "current run がありません。"
						: "next run がありません。"}
				</div>
			) : (
				<>
					{renderSection("走者", runners, runnerCh, "runners")}
					{renderSection("解説", commentators, commentatorCh, "commentators")}
				</>
			)}
		</div>
	);
};

// 卓テンプレートの編集（プルダウンで流し込む初期値）
const DeckTemplates = () => {
	const decks = useReplicant("audio-decks");

	const parseCsv = (csv: string): number[] =>
		csv
			.split(",")
			.map((s) => parseInt(s.trim(), 10))
			.filter((n) => !Number.isNaN(n));

	const setTemplate = (
		d: "A" | "B",
		kind: "runners" | "commentators",
		csv: string,
	) => {
		const cur = decks?.[d] ?? {runners: [], commentators: []};
		decksRep.value = {
			...(decks ?? {}),
			[d]: {...cur, [kind]: parseCsv(csv)},
		};
	};

	const fmt = (arr?: number[]) => (arr ?? []).join(", ");

	return (
		<details style={{marginTop: 6}}>
			<summary style={{cursor: "pointer", fontSize: 13, opacity: 0.7}}>
				卓テンプレート編集（プルダウン選択時の初期値）
			</summary>
			<div style={{marginTop: 8, fontSize: 12, opacity: 0.7}}>
				走者と解説それぞれの WING メーター index をカンマ区切りで入力。 A卓は
				ch1-16（index 0-15）、B卓は ch17-32（index 16-31）が目安。
			</div>
			{(["A", "B"] as const).map((d) => (
				<div key={d} style={{marginTop: 6}}>
					<label style={labelStyle}>{d}卓テンプレート</label>
					<div
						style={{display: "grid", gridTemplateColumns: "60px 1fr", gap: 6}}
					>
						<div style={{fontSize: 11, opacity: 0.6, alignSelf: "center"}}>
							走者
						</div>
						<input
							type='text'
							defaultValue={fmt(decks?.[d]?.runners)}
							placeholder='0, 1, 2, 3'
							style={{width: "100%"}}
							onBlur={(e) => setTemplate(d, "runners", e.currentTarget.value)}
						/>
						<div style={{fontSize: 11, opacity: 0.6, alignSelf: "center"}}>
							解説
						</div>
						<input
							type='text'
							defaultValue={fmt(decks?.[d]?.commentators)}
							placeholder='4, 5'
							style={{width: "100%"}}
							onBlur={(e) =>
								setTemplate(d, "commentators", e.currentTarget.value)
							}
						/>
					</div>
				</div>
			))}
		</details>
	);
};

// 全メーター一覧（index特定用）
const MeterList = () => {
	const meters = useReplicant("audio-meters") ?? [];
	return (
		<details style={{marginTop: 10}}>
			<summary style={{cursor: "pointer", fontSize: 13, opacity: 0.7}}>
				全メーター一覧（index特定用）
			</summary>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(60px,1fr))",
					gap: 3,
					marginTop: 6,
				}}
			>
				{meters.map((v, idx) => (
					<div
						key={idx}
						style={{
							background: "#23272f",
							borderRadius: 4,
							padding: "4px 2px",
							textAlign: "center",
							fontSize: 11,
						}}
					>
						<div style={{opacity: 0.5}}>#{idx}</div>
						<div>{v.toFixed(0)}</div>
					</div>
				))}
			</div>
		</details>
	);
};

const App = () => {
	return (
		<div style={{padding: 12, fontFamily: "sans-serif"}}>
			<ConnectionSettings />
			<DeckSection slot='current' title='Current（本番）' highlight={true} />
			<DeckSection slot='next' title='Next（準備）' highlight={false} />
			<DeckTemplates />
			<MeterList />
		</div>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
