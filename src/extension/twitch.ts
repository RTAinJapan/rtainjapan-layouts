import {
	exchangeCode,
	StaticAuthProvider,
	RefreshingAuthProvider,
} from "@twurple/auth";
import {ApiClient, HelixUser} from "@twurple/api";
import express from "express";
import {NodeCG} from "./nodecg";

export const twitch = (nodecg: NodeCG) => {
	const log = new nodecg.Logger("twitch");

	const twitchConfig = nodecg.bundleConfig.twitch;
	if (!twitchConfig) {
		log.warn("Missing Twitch config");
		return;
	}

	const twitchRep = nodecg.Replicant("twitchOauth");
	const currentRunRep = nodecg.Replicant("current-run");
	const scheduleRep = nodecg.Replicant("schedule");

	const redirectPath = "/twitch-auth-callback";
	const redirectUrl = new URL(redirectPath, `http://${nodecg.config.baseURL}`);
	const authPageUrl = new URL("https://id.twitch.tv/oauth2/authorize");
	authPageUrl.searchParams.append("client_id", twitchConfig.clientId);
	authPageUrl.searchParams.append("redirect_uri", redirectUrl.href);
	authPageUrl.searchParams.append("response_type", "code");
	authPageUrl.searchParams.append(
		"scope",
		"channel:manage:broadcast user:edit:broadcast",
	);
	log.warn("TWITCH AUTHENTICATION URL:", authPageUrl.href);

	const redirectApp = express();
	redirectApp.get("/", async (req, res) => {
		try {
			const {code} = req.query;
			if (typeof code !== "string") {
				res.status(400).send("Invalid authorization code");
				return;
			}
			const accessToken = await exchangeCode(
				twitchConfig.clientId,
				twitchConfig.clientSecret,
				code,
				redirectUrl.href,
			);
			const apiClient = new ApiClient({
				authProvider: new StaticAuthProvider(
					twitchConfig.clientId,
					accessToken,
				),
			});
			const me = await apiClient.users.getMe();
			if (me.name !== twitchConfig.channelName) {
				res.status(400).send(`Not a user to register: ${me.name}`);
				return;
			}
			twitchRep.value = accessToken;
			res.status(200).send(`Successfully registered user ${me.name}`);
		} catch (error: unknown) {
			res.status(500).send("Server error while getting Twitch access token");
			log.error("Server error while getting Twitch access token", error);
		}
	});
	nodecg.mount(redirectPath, redirectApp);

	let apiClient: ApiClient | undefined;
	let channelId: HelixUser | undefined;

	twitchRep.on("change", async (twitchOauth) => {
		try {
			if (!twitchOauth) {
				apiClient = undefined;
				return;
			}
			const authProvider = new RefreshingAuthProvider(
				{
					clientId: twitchConfig.clientId,
					clientSecret: twitchConfig.clientSecret,
					onRefresh: (tokenInfoData) => {
						twitchRep.value = tokenInfoData;
					},
				},
				twitchOauth,
			);
			apiClient = new ApiClient({authProvider});
			const res = await apiClient.users.getUserByName(twitchConfig.channelName);
			if (res) {
				channelId = res;
			}
		} catch (error: unknown) {
			log.error("Failed to setup API client", error);
			apiClient = undefined;
		}
	});

	let lastUpdatedTitle = "";
	let titleRetryCount = 0;
	const update = async () => {
		try {
			if (!apiClient || !channelId) {
				return;
			}
			const newRun = scheduleRep.value?.find(
				(run) => run.pk === currentRunRep.value?.pk,
			);
			if (!newRun) {
				return;
			}
			const title = `RTA in Japan Winter 2022: ${newRun.title}`;
			if (lastUpdatedTitle === title) {
				return;
			}
			await apiClient.channels.updateChannelInfo(channelId, {
				title,
				gameId: newRun.twitchGameId,
			});
			lastUpdatedTitle = title;
			titleRetryCount = 0;
			log.info(`Updated title to: ${title}`);
		} catch (error) {
			if (titleRetryCount >= 5) {
				log.error("Failed to update title:", error);
				titleRetryCount = 0;
				return;
			}
			titleRetryCount += 1;
			await update();
		}
	};

	currentRunRep.on("change", update);
	scheduleRep.on("change", update);
};
