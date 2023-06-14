import WebSocket from "ws";
import {NodeCG} from "./nodecg";
import {sheets} from "@googleapis/sheets";
import type EventSample from "./sample-json/tracker/event.json";
import type RunSample from "./sample-json/tracker/run.json";
import type RunnerSample from "./sample-json/tracker/runner.json";
import type BidSample from "./sample-json/tracker/bid.json";
import type BidTargetSample from "./sample-json/tracker/bidtarget.json";
import type DonationSample from "./sample-json/tracker/donation.json";
import {BidChallenge, Donation, Run} from "../nodecg/replicants";
import {klona as clone} from "klona/json";
import {uniqBy, zipObject} from "./lib/array";

type CommentDonation = (typeof DonationSample)[number] & {
	fields: {comment: string};
};

let eventName: string | null = null;

export const getEventName = () => {
	return eventName;
};

export const tracker = async (nodecg: NodeCG) => {
	const {default: got} = await import("got");

	const log = new nodecg.Logger("tracker");
	const trackerConfig = nodecg.bundleConfig.tracker;
	const {googleApiKey, commentatorSheet} = nodecg.bundleConfig;

	if (!trackerConfig) {
		log.warn("tracker is not configured in the bundle config");
		return;
	}

	const scheduleRep = nodecg.Replicant("schedule");
	const donationTotalRep = nodecg.Replicant("donation-total");
	const bidwarRep = nodecg.Replicant("bid-war");
	const bidChallengeRep = nodecg.Replicant("bid-challenge");
	const runnersRep = nodecg.Replicant("runners");
	const donationsRep = nodecg.Replicant("donations");
	const donationQueueRep = nodecg.Replicant("donation-queue", {
		defaultValue: [],
	});
	const checklistRep = nodecg.Replicant("checklist");

	const requestSearch = async <T>(type: string) => {
		const schema = trackerConfig.secure ? "https" : "http";
		const url = new URL("/search", `${schema}://${trackerConfig.domain}`);
		url.searchParams.append("type", type);
		if (type !== "event") {
			url.searchParams.append("event", String(trackerConfig.event));
		}
		const res = await got.get(url.href).json<T>();
		return res;
	};

	const updateEventData = async () => {
		try {
			const res = await requestSearch<typeof EventSample>("event");
			const event = res.find((e) => e.pk === trackerConfig.event);

			eventName = event?.fields.name || null;

			const total = event?.fields.amount;
			donationTotalRep.value = total;
		} catch (error) {
			log.error(error);
		}
	};

	const sheetsApi = sheets({version: "v4", auth: googleApiKey});
	const fetchCommentators = async () => {
		try {
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
		} catch (error: any) {
			log.error(error.message);
			return [];
		}
	};

	const updateRuns = async () => {
		try {
			const prevSchedule = scheduleRep.value ? clone(scheduleRep.value) : [];
			const [runs, runners, commentators] = await Promise.all([
				requestSearch<typeof RunSample>("run"),
				requestSearch<typeof RunnerSample>("runner"),
				fetchCommentators(),
			]);
			scheduleRep.value = runs
				.filter((run) => {
					// バックアップゲームをスケジュールから除外
					return run.fields.order !== null;
				})
				.map<Run>((run, index) => {
					const prevCompletedChecklist =
						prevSchedule.find((prevRun) => prevRun.pk === run.pk)
							?.completedChecklist ?? [];
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
						camera: true,
						runners: run.fields.runners.map((runnerId) => {
							const runner = runners.find((runner) => runner.pk === runnerId);
							return {
								name: runner?.fields.name || "",
								twitch: runner?.fields.twitch,
								nico: runner?.fields.nico,
								twitter: runner?.fields.twitter,
								camera: true,
							};
						}),
						commentators: commentators
							.filter((commentator) => {
								return commentator.gameCategory.endsWith(`- ${run.pk}`);
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
						twitchGameId: run.fields.twitch_name,
						completedChecklist:
							checklistRep.value
								?.filter((checklist) => {
									return prevCompletedChecklist.includes(checklist.pk);
								})
								.map((checklist) => checklist.pk) ?? [],
					};
				});
			runnersRep.value = runners.map((runner) => runner.fields.name);
		} catch (error) {
			log.error(error);
		}
	};

	const updateBids = async () => {
		try {
			const [bids, bidTargets] = await Promise.all([
				requestSearch<typeof BidSample>("bid"),
				requestSearch<typeof BidTargetSample>("bidtarget"),
			]);
			const openTargets = bidTargets.filter(
				(target) => target.fields.state === "OPENED",
			);
			const updatedBidWars = bids
				.filter((bid) => bid.fields.state === "OPENED" && !bid.fields.istarget)
				.sort((a, b) => a.fields.speedrun__order - b.fields.speedrun__order)
				.map((bid) => {
					return {
						pk: bid.pk,
						name: bid.fields.name,
						game: bid.fields.speedrun__name,
						targets: openTargets
							.filter((target) => target.fields.parent === bid.pk)
							.sort((a, b) => Number(b.fields.total) - Number(a.fields.total))
							.map((target) => {
								const {name, total} = target.fields;
								return {
									pk: target.pk,
									name,
									total: Number(total),
									percent:
										Number(bid.fields.total) === 0
											? 0
											: Number(target.fields.total) / Number(bid.fields.total),
								};
							}),
					};
				});
			bidwarRep.value = updatedBidWars;

			const updatedBidChallenges = bids
				.filter(
					(bid) =>
						bid.fields.state === "OPENED" &&
						bid.fields.istarget &&
						Number(bid.fields.goal) > 0,
				)
				.sort((a, b) => a.fields.speedrun__order - b.fields.speedrun__order)
				.map((bid): BidChallenge[number] => ({
					pk: bid.pk,
					name: bid.fields.name,
					game: bid.fields.speedrun__name,
					goal: Number(bid.fields.goal),
					total: Number(bid.fields.total),
					percent:
						Number(bid.fields.total) === 0
							? 0
							: Number(bid.fields.total) / Number(bid.fields.goal),
				}));
			bidChallengeRep.value = updatedBidChallenges;
		} catch (error) {
			log.error(error);
		}
	};

	const updateDonations = async () => {
		try {
			const lastDonations = Object.fromEntries(
				donationsRep.value?.map((d) => [d.pk, d]) || [],
			);
			const donations = await requestSearch<typeof DonationSample>("donation");

			const updated = donations
				.sort((a, b) => b.pk - a.pk)
				.filter(
					(donation): donation is CommentDonation => !!donation.fields.comment,
				)
				.map((donation): Donation => {
					const exists = lastDonations[donation.pk];
					return {
						pk: donation.pk,
						name:
							donation.fields.donor__public === "(匿名)"
								? null
								: donation.fields.donor__public,
						amount: donation.fields.amount,
						comment: donation.fields.comment,
						featured: exists?.featured || false,
					};
				});
			donationsRep.value = updated;
		} catch (error) {
			log.error(error);
		}
	};

	updateEventData();
	updateRuns();
	updateBids();
	updateDonations();
	setInterval(() => {
		updateEventData();
		updateRuns();
		updateBids();
		updateDonations();
	}, 10 * 1000);

	const connectWebSocket = () => {
		if (!trackerConfig.websocket) {
			log.warn(
				"`websocket` config is empty. NodeCG will not connect to donation tracker's WebSocket.",
			);
			return;
		}

		const schema = trackerConfig.secure ? "wss" : "ws";
		const url = new URL(
			trackerConfig.websocket,
			`${schema}://${trackerConfig.domain}`,
		);
		log.warn("connecting websocket", url.href);
		const ws = new WebSocket(url.href, {origin: url.href});

		ws.addEventListener("message", ({data}) => {
			try {
				const dataString = String(data);
				log.info(dataString);
				const {amount, new_total: total} = JSON.parse(dataString);
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

	const pushDonationToQueue = (pk: number) => {
		const donation = donationsRep.value?.find((d) => d.pk === pk);

		if (!donation) {
			return;
		}

		donation.featured = true;

		donationQueueRep.value = uniqBy(
			[...donationQueueRep.value, {...donation}],
			(d) => d.pk,
		);
	};

	const removeDonationFromQueue = (pk: number) => {
		donationQueueRep.value = donationQueueRep.value.filter((d) => d.pk !== pk);
	};

	nodecg.listenFor("donation:feature", pushDonationToQueue);
	nodecg.listenFor("donation:cancel", removeDonationFromQueue);
	nodecg.listenFor("donation:clear-queue", () => {
		donationQueueRep.value = [];
	});

	connectWebSocket();
};
