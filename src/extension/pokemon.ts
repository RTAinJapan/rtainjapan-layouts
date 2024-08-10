import {JSDOM} from "jsdom";
import {NodeCG} from "./nodecg";

const GET_COUNT_INTERVAL_SECONDS = 10;

export const pokemon = async (nodecg: NodeCG) => {
	const {default: got} = await import("got");

	const logger = new nodecg.Logger("pokemon");
	const pokeRep = nodecg.Replicant("poke", {defaultValue: 0});
	const pokemonControlRep = nodecg.Replicant("pokemon-control", {
		defaultValue: {
			url: "",
			enableScraping: false,
		},
	});

	const parseCurrentCount = (text: string): number => {
		const [current] = text.split("/");
		return parseInt(current?.trim() || "");
	};

	const fetchCurrentCountFromUrl = async (): Promise<number | null> => {
		if (!pokemonControlRep.value.url) {
			logger.warn("Request URL for getting pokemon progress is not set.");
			return null;
		}
		try {
			const response = await got.get(pokemonControlRep.value.url);
			if (response.statusCode !== 200) {
				logger.error(`Failed to request by status code ${response.statusCode}`);
				return null;
			}
			const dom = new JSDOM(response.body);
			const [, summaryDivDom] = dom.window.document.querySelectorAll(
				".widget_summary > div",
			);
			const summaryText = summaryDivDom?.textContent;
			if (!summaryText) {
				logger.error("Success to request but summary is not found.");
				return null;
			}
			const currentCount = parseCurrentCount(summaryText);
			if (isNaN(currentCount)) {
				logger.error("Failed to parse summary text.");
				return null;
			}
			return currentCount;
		} catch (e) {
			logger.error("Failed to request.");
			logger.error(e);
			return null;
		}
	};

	setInterval(async () => {
		if (!pokemonControlRep.value.enableScraping) {
			return;
		}
		const current = await fetchCurrentCountFromUrl();
		if (!current) {
			return;
		}
		pokeRep.value = current;
	}, GET_COUNT_INTERVAL_SECONDS * 1000);
};
