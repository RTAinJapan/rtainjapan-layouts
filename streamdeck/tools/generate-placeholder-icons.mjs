// Generates simple solid-colour placeholder PNG icons for the plugin so the
// `.sdPlugin` loads cleanly in Stream Deck. Replace these with real artwork.
//
// Run with: node tools/generate-placeholder-icons.mjs

import {deflateSync} from "node:zlib";
import {mkdirSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_DIR = join(ROOT, "jp.rtainjapan.layouts.sdPlugin");

// RTA in Japan teal (matches the dashboard header colour #00BEBE).
const COLOR = [0, 190, 190];

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[n] = c >>> 0;
	}
	return table;
})();

function crc32(buf) {
	let c = 0xffffffff;
	for (let i = 0; i < buf.length; i++) {
		c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
	}
	return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
	const length = Buffer.alloc(4);
	length.writeUInt32BE(data.length, 0);
	const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(body), 0);
	return Buffer.concat([length, body, crc]);
}

function solidPng(size, [r, g, b]) {
	const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(size, 0);
	ihdr.writeUInt32BE(size, 4);
	ihdr[8] = 8; // bit depth
	ihdr[9] = 2; // colour type: truecolour (RGB)

	const row = Buffer.alloc(1 + size * 3);
	for (let x = 0; x < size; x++) {
		row[1 + x * 3] = r;
		row[2 + x * 3] = g;
		row[3 + x * 3] = b;
	}
	const raw = Buffer.concat(Array.from({length: size}, () => row));
	const idat = deflateSync(raw, {level: 9});

	return Buffer.concat([
		signature,
		chunk("IHDR", ihdr),
		chunk("IDAT", idat),
		chunk("IEND", Buffer.alloc(0)),
	]);
}

// [relative path without extension, base size]
const ICONS = [
	["imgs/plugin/marketplace", 256],
	["imgs/plugin/category", 28],
	["imgs/actions/icon", 20],
	["imgs/actions/key", 72],
];

for (const [path, size] of ICONS) {
	for (const [suffix, scale] of [
		["", 1],
		["@2x", 2],
	]) {
		const file = join(PLUGIN_DIR, `${path}${suffix}.png`);
		mkdirSync(dirname(file), {recursive: true});
		writeFileSync(file, solidPng(size * scale, COLOR));
		console.log(`wrote ${path}${suffix}.png (${size * scale}px)`);
	}
}
