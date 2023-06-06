import type {NodeCG} from "./nodecg";
import * as cheerio from "cheerio";

const readTweet = async (url: string) => {
	const {got} = await import("got");
	const {body} = await got.get(url, {
		headers: {"User-Agent": "bot"},
	});
	const $ = cheerio.load(body);
	return {
		content: $('meta[property="og:description"]').attr("content"),
		image: $('meta[property="og:image"]').attr("content"),
	};
};

export const setupTwitter = async (nodecg: NodeCG) => {
	console.log(
		await readTweet(
			"https://twitter.com/GamesDoneQuick/status/1654676245257375745",
		),
	);
};
