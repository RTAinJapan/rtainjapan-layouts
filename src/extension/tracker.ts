import got from "got";
import WebSocket from "ws";
import {NodeCG} from "./nodecg";
import {sheets} from "@googleapis/sheets";
import zipObject from "lodash/zipObject";
import type EventSample from "./sample-json/tracker/event.json";
import type RunSample from "./sample-json/tracker/run.json";
import type RunnerSample from "./sample-json/tracker/runner.json";

export const tracker = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("tracker");
	const trackerConfig = nodecg.bundleConfig.tracker;
	const {googleApiKey, commentatorSheet} = nodecg.bundleConfig;

	if (!trackerConfig || !googleApiKey || !commentatorSheet) {
		log.warn("tracker is not configured in the bundle config");
		return;
	}

	const scheduleRep = nodecg.Replicant("schedule");
	const donationTotalRep = nodecg.Replicant("donation-total");

	const requestSearch = async <T>(type: string) => {
		const url = new URL("/search", `https://${trackerConfig.domain}`);
		url.searchParams.append("type", type);
		if (type !== "event") {
			url.searchParams.append("event", String(trackerConfig.event));
		}
		const res = await got.get(url.href).json<T>();
		return res;
	};

	const updateTotal = async () => {
		try {
			const res = await requestSearch<typeof EventSample>("event");
			const total = res.find((e) => e.pk === trackerConfig.event)?.fields
				.amount;
			donationTotalRep.value = total;
		} catch (error) {
			log.error(error);
		}
	};

	const sheetsApi = sheets({version: "v4", auth: googleApiKey});
	const fetchCommentators = async () => {
		const res = await sheetsApi.spreadsheets.values.batchGet({
			spreadsheetId: commentatorSheet,
			ranges: ["解説応募"],
		});
		const sheetValues = res.data.valueRanges;
		if (!sheetValues?.[0]?.values) {
			throw new Error("Could not get values from spreadsheet");
		}
		const [labels, ...contents] = sheetValues[0].values;
		if (!labels) {
			throw new Error("Could not get values from spreadsheet");
		}
		const rawData = contents.map((content) => zipObject(labels, content));
		return rawData.map((el) => {
			return {
				name: el["名前 (ニックネーム)"] as string,
				twitter: el["Twitter ID"] as string,
				twitch: el["Twitch ID"] as string,
				nico: el["ニコニココミュニティ ID"] as string,
				gameCategory: el["担当ゲームカテゴリ"] as string,
			};
		});
	};
	const updateRuns = async () => {
		try {
			const [runs, runners, commentators] = await Promise.all([
				requestSearch<typeof RunSample>("run"),
				requestSearch<typeof RunnerSample>("runner"),
				fetchCommentators(),
			]);
			scheduleRep.value = runs.map((run, index) => {
				return {
					pk: run.pk,
					index,
					title: run.fields.name,
					englishTitle: run.fields.twitch_name,
					category: run.fields.category,
					platform: run.fields.console,
					releaseYear: run.fields.release_year,
					runDuration: run.fields.run_time,
					setupDuration: run.fields.setup_time,
					camera: false,
					runners: run.fields.runners.map((runnerId) => {
						const runner = runners.find((runner) => runner.pk === runnerId);
						return {
							name: runner?.fields.name || "",
							twitch: runner?.fields.twitch,
							nico: runner?.fields.nico,
							twitter: runner?.fields.twitter,
							camera: false,
						};
					}),
					commentators: commentators
						.filter((commentator) => {
							return commentator.gameCategory.startsWith(run.fields.name);
						})
						.map((commentator) => {
							return {
								name: commentator.name,
								twitch: commentator.twitch,
								nico: commentator.nico,
								twitter: commentator.twitter,
								camera: false,
							};
						}),
				};
			});
		} catch (error) {
			log.error(error);
		}
	};

	updateTotal();
	updateRuns();
	setInterval(() => {
		updateTotal();
		updateRuns();
	}, 10 * 1000);

	const connectWebSocket = () => {
		const url = new URL(
			trackerConfig.websocket,
			`wss://${trackerConfig.domain}`,
		);
		log.warn("connecting websocket", url.href);
		const ws = new WebSocket(url.href, {origin: url.href});

		ws.addEventListener("message", ({data}) => {
			try {
				log.info(data);
				const {amount, new_total: total} = JSON.parse(data);
				nodecg.sendMessage("donation", {
					amount: parseInt(amount),
					total: parseInt(total),
				});
				donationTotalRep.value = parseInt(total);
			} catch (error) {
				log.error(error);
			}
		});
		ws.addEventListener("close", ({wasClean, code, reason}) => {
			log.error("websocket closed:", {wasClean, code, reason});
			setTimeout(connectWebSocket, 10 * 1000);
		});
		ws.addEventListener("error", ({type, message}) => {
			log.error("websocket error:", {type, message});
		});
		ws.addEventListener("open", () => {
			log.warn("websocket opened");
		});
	};

	connectWebSocket();
};
