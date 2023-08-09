import {PlayingMusic} from "../nodecg/replicants";
import {NodeCG} from "./nodecg";
import express from "express";

type UpdateMusicRequest = {
	id: string;
	data: PlayingMusic;
};

export const music = (nodecg: NodeCG) => {
	const basePath = "/playing-music";
	const log = new nodecg.Logger("music");

	const playingMusicRep = nodecg.Replicant("playing-music", {defaultValue: ""});

	const updatePlayingMusic = (music: PlayingMusic) => {
		playingMusicRep.value = music;
		log.debug(`Update playing music to "${music}"`);
	};

	const router = express();
	router.put<never, string, UpdateMusicRequest>("/", (req, res) => {
		try {
			const playingMusic = req.body.data;
			updatePlayingMusic(playingMusic);

			res.status(204).send();
		} catch (err: unknown) {
			log.error("Unknown error is happened on update playing music", err);
			res.status(500).send();
		}
	});

	nodecg.mount(basePath, router);
	log.warn(
		`Mounted update playing-music API to: ${new URL(
			basePath,
			`${nodecg.config.ssl ? "https" : "http"}://${nodecg.config.baseURL}`,
		)}`,
	);
};
