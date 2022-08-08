import {setTimeout} from "timers";
import got from "got";
import appRootPath from "app-root-path";
import {NodeCG} from "./nodecg";

// TODO: move to config
const OUR_CHANNEL = "rtainjapan";

export const twitch = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("twitch");
	if (
		!nodecg.config.login ||
		!nodecg.config.login.enabled ||
		!nodecg.config.login.twitch ||
		!nodecg.config.login.twitch.enabled
	) {
		log.warn("Twitch login is disabled");
		return;
	}

	const twitchConfig = nodecg.config.login.twitch;
	if (!twitchConfig.scope.split(" ").includes("channel_editor")) {
		log.error("Missing channel_editor scope, exiting.");
		return;
	}

	const twitchRep = nodecg.Replicant("twitch");
	const currentRunRep = nodecg.Replicant("current-run");
	const scheduleRep = nodecg.Replicant("schedule");
	const {clientSecret} = appRootPath.require("../../cfg/nodecg.json").login
		.twitch;

	const refreshAccessToken = async () => {
		try {
			if (!twitchRep.value || !twitchRep.value.refresh) {
				return;
			}
			const response = await got
				.post("https://id.twitch.tv/oauth2/token", {
					form: {
						grant_type: "refresh_token",
						refresh_token: twitchRep.value.refresh.refreshToken,
						client_id: twitchConfig.clientID,
						client_secret: clientSecret,
						scope: twitchConfig.scope,
					},
				})
				.json<{
					expires_in: number;
					access_token: string;
					refresh_token: string;
				}>();
			const expiresInMs = response.expires_in * 1000;
			setTimeout(refreshAccessToken, expiresInMs);

			twitchRep.value.accessToken = response.access_token;
			twitchRep.value.refresh = {
				refreshToken: response.refresh_token,
				refreshAt: Date.now() + expiresInMs,
			};
			log.warn("Refreshed token");
		} catch (error) {
			log.error("Failed to refresh token:", error);
		}
	};

	let lastUpdateTitle = "";
	const updateTitle = async () => {
		try {
			const newRun = scheduleRep.value?.find(
				(run) => run.pk === currentRunRep.value?.pk,
			);
			if (!newRun) {
				return;
			}
			if (!twitchRep.value || !twitchRep.value.accessToken) {
				log.error("Tried to update Twitch status but missing access token");
				return;
			}
			const newTitle = `RTA in Japan ex #1: ${newRun.title}`;
			if (lastUpdateTitle === newTitle) {
				return;
			}
			await got.put(
				`https://api.twitch.tv/kraken/channels/${twitchRep.value.channelId}`,
				{
					json: {
						channel: {
							status: newTitle,
							game: newRun.englishTitle,
						},
					},
					headers: {
						Accept: "application/vnd.twitchtv.v5+json",
						Authorization: `OAuth ${twitchRep.value.accessToken}`,
						"Client-ID": twitchConfig.clientID,
					},
				},
			);
			lastUpdateTitle = newTitle;
			log.info(
				`Updated Twitch status to ${newRun.title} (${newRun.englishTitle})`,
			);
		} catch (error) {
			log.error("Failed to update Twitch status", error);
		}
	};

	const loginLib = appRootPath.require("../../lib/login");
	loginLib.on("login", (session: any) => {
		const {user} = session.passport;
		if (user.provider !== "twitch" || user.username !== OUR_CHANNEL) {
			return;
		}
		twitchRep.value = {
			accessToken: user.accessToken,
			channelId: user.id,
			refresh: {
				refreshToken: user.refreshToken,
				refreshAt: Date.now(),
			},
		};
		log.info(`Twitch title updater is enabled for ${user.username}`);
		refreshAccessToken();
	});
	currentRunRep.on("change", updateTitle);
	scheduleRep.on("change", updateTitle);

	twitchRep.once("change", (newVal) => {
		if (newVal.refresh) {
			const refreshIn = newVal.refresh.refreshAt - Date.now();
			setTimeout(() => {
				refreshAccessToken();
			}, refreshIn);
		}
	});
};
