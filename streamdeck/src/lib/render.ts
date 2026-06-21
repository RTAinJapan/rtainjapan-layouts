// Renders Stream Deck key images as inline SVG data URIs so keys can show the
// runner name, status text and a status colour without shipping per-state PNGs.

export type KeyColor =
	| "idle"
	| "running"
	| "finished"
	| "forfeit"
	| "empty"
	| "offline";

const COLORS: Record<KeyColor, {bg: string; fg: string; sub: string}> = {
	idle: {bg: "#2b2b2b", fg: "#ffffff", sub: "#b0b0b0"},
	running: {bg: "#1565c0", fg: "#ffffff", sub: "#cfe0f5"},
	finished: {bg: "#2e7d32", fg: "#ffffff", sub: "#d6ecd7"},
	forfeit: {bg: "#424242", fg: "#ffffff", sub: "#d6d6d6"},
	empty: {bg: "#161616", fg: "#6f6f6f", sub: "#5a5a5a"},
	offline: {bg: "#5a1a1a", fg: "#ffd9d9", sub: "#e7a3a3"},
};

const SIZE = 144;
const MARGIN = 10;

const escapeXml = (value: string): string =>
	value.replace(/[<>&'"]/g, (char) => {
		switch (char) {
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
			case "'":
				return "&apos;";
			default:
				return "&quot;";
		}
	});

/**
 * Builds an SVG key image with a coloured background, a bold title and an
 * optional smaller subtitle.
 *
 * Text is never truncated: with `align: "start"` a long title is left-aligned
 * and simply overflows past the right edge of the key (clipped by its bounds).
 */
export function renderKey(options: {
	title: string;
	subtitle?: string;
	color: KeyColor;
	align?: "center" | "start";
}): string {
	const {bg, fg, sub} = COLORS[options.color];
	const align = options.align ?? "center";
	const anchor = align === "start" ? "start" : "middle";
	const x = align === "start" ? MARGIN : SIZE / 2;

	const title = escapeXml(options.title);
	const subtitle =
		options.subtitle === undefined ? "" : escapeXml(options.subtitle);

	const titleY = subtitle ? 66 : 80;
	const titleText = `<text x="${x}" y="${titleY}" fill="${fg}" font-family="sans-serif" font-size="26" font-weight="700" text-anchor="${anchor}">${title}</text>`;
	const subtitleText = subtitle
		? `<text x="${x}" y="98" fill="${sub}" font-family="sans-serif" font-size="20" text-anchor="${anchor}">${subtitle}</text>`
		: "";

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="18" fill="${bg}"/>${titleText}${subtitleText}</svg>`;
	// Stream Deck accepts a base64-encoded SVG data URI; this is more reliable
	// than a charset=utf8/URL-encoded data URI across Stream Deck versions.
	return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString(
		"base64",
	)}`;
}

/**
 * Builds a three-line "action" key image:
 *  - line 1: the target the button represents (normal size),
 *  - line 2: its current state (small caption),
 *  - line 3: the action the button performs (large, bold).
 *
 * Used by the master-timer and fan-art keys so each key reads as
 * "{対象} / {状態} / {アクション}" (e.g. タイマー / 停止中 / 開始).
 */
export function renderActionKey(options: {
	target: string;
	state?: string;
	action: string;
	color: KeyColor;
	align?: "center" | "start";
}): string {
	const {bg, fg, sub} = COLORS[options.color];
	const align = options.align ?? "center";
	const anchor = align === "start" ? "start" : "middle";
	const x = align === "start" ? MARGIN : SIZE / 2;
	const target = escapeXml(options.target);
	const action = escapeXml(options.action);
	const state = options.state === undefined ? "" : escapeXml(options.state);

	const targetText = `<text x="${x}" y="34" fill="${fg}" font-family="sans-serif" font-size="20" text-anchor="${anchor}">${target}</text>`;
	const stateText = state
		? `<text x="${x}" y="58" fill="${sub}" font-family="sans-serif" font-size="14" text-anchor="${anchor}">${state}</text>`
		: "";
	const actionText = `<text x="${x}" y="110" fill="${fg}" font-family="sans-serif" font-size="30" font-weight="700" text-anchor="${anchor}">${action}</text>`;

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="18" fill="${bg}"/>${targetText}${stateText}${actionText}</svg>`;
	return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString(
		"base64",
	)}`;
}
