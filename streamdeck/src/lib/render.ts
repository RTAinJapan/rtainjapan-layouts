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
	forfeit: {bg: "#546e7a", fg: "#ffffff", sub: "#dfe6ea"},
	empty: {bg: "#161616", fg: "#6f6f6f", sub: "#5a5a5a"},
	offline: {bg: "#5a1a1a", fg: "#ffd9d9", sub: "#e7a3a3"},
};

const SIZE = 144;

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

const fit = (value: string, max: number): string =>
	value.length > max ? `${value.slice(0, max - 1)}…` : value;

/**
 * Builds an SVG key image with a coloured background, a bold title and an
 * optional smaller subtitle.
 */
export function renderKey(options: {
	title: string;
	subtitle?: string;
	color: KeyColor;
}): string {
	const {bg, fg, sub} = COLORS[options.color];
	const title = escapeXml(fit(options.title, 9));
	const subtitle =
		options.subtitle === undefined ? "" : escapeXml(fit(options.subtitle, 11));

	const titleY = subtitle ? 66 : 80;
	const titleText = `<text x="${
		SIZE / 2
	}" y="${titleY}" fill="${fg}" font-family="sans-serif" font-size="26" font-weight="700" text-anchor="middle">${title}</text>`;
	const subtitleText = subtitle
		? `<text x="${
				SIZE / 2
		  }" y="98" fill="${sub}" font-family="sans-serif" font-size="20" text-anchor="middle">${subtitle}</text>`
		: "";

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="18" fill="${bg}"/>${titleText}${subtitleText}</svg>`;
	return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}
