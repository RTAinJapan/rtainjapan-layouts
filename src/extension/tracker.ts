import got from "got";
import WebSocket from "ws";
import {NodeCG} from "./nodecg";

export const tracker = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("tracker");
	const trackerConfig = nodecg.bundleConfig.tracker;

	if (!trackerConfig) {
		log.warn("tracker is not configured in the bundle config");
		return;
	}

	const donationTotalRep = nodecg.Replicant("donation-total");

	// simple polling as a backup
	setInterval(async () => {
		try {
			const res = await got.get("https://tracker.rtain.jp/search/?type=event", {
				json: true,
			});
			const total = res.body.find((e: any) => e.pk === 1).fields.amount;
			donationTotalRep.value = total;
		} catch (error) {
			log.error(error);
		}
	}, 30 * 1000);

	const connectWebSocket = () => {
		// TODO: /tracker/ws/donations
		const url = new URL(trackerConfig.url).href;
		log.warn("connecting websocket", url);
		const ws = new WebSocket(url, {origin: url});

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
