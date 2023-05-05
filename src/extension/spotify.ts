import {setTimeout} from "node:timers";
import {isEqual} from "lodash";
import {NodeCG} from "./nodecg";

const defaultWaitMs = 3 * 1000;

const sumArtists = (artists: Array<{name: string}>) => {
	return artists.map((artist) => artist.name).join(", ");
};

const base64Encode = (str: string) => {
	return Buffer.from(str).toString("base64");
};

export const spotify = async (nodecg: NodeCG) => {
	const {default: got, RequestError} = await import("got");

	const logger = new nodecg.Logger("spotify");
	const spotifyConfig = nodecg.bundleConfig.spotify;
	if (!spotifyConfig) {
		logger.warn("Spotify config is empty");
		return;
	}

	const spotifyRep = nodecg.Replicant("spotify");
	const redirectUrl = `http://${nodecg.config.baseURL}/bundles/${nodecg.bundleName}/spotify-callback/index.html`;

	let currentTrackTimer: NodeJS.Timer | undefined;
	const refreshCurrentTrackTimer = (timer: NodeJS.Timer) => {
		if (currentTrackTimer) {
			clearTimeout(currentTrackTimer);
		}
		currentTrackTimer = timer;
	};

	let authorizeTimer: NodeJS.Timer | undefined;
	const refreshAuthorizeTimer = (timer: NodeJS.Timer) => {
		if (authorizeTimer) {
			clearTimeout(authorizeTimer);
		}
		authorizeTimer = timer;
	};

	const getCurrentTrack = async () => {
		if (!spotifyRep.value) {
			return;
		}

		try {
			const token = spotifyRep.value.accessToken;
			if (!token) {
				refreshCurrentTrackTimer(setTimeout(getCurrentTrack, defaultWaitMs));
				return;
			}
			const res = await got.get(
				"https://api.spotify.com/v1/me/player/currently-playing",
				{
					searchParams: {
						market: "from_token",
					},
					headers: {Authorization: `Bearer ${token}`},
				},
			);
			if (res.statusCode === 204) {
				spotifyRep.value.currentTrack = undefined;
				refreshCurrentTrackTimer(setTimeout(getCurrentTrack, defaultWaitMs));
				return;
			}
			const body = JSON.parse(res.body);
			const newTrack = {
				name: body.item.name,
				artists: sumArtists(body.item.artists),
				album: body.item.album.name,
			};
			if (!isEqual(newTrack, spotifyRep.value.currentTrack)) {
				spotifyRep.value.currentTrack = newTrack;
			}
			refreshCurrentTrackTimer(setTimeout(getCurrentTrack, defaultWaitMs));
		} catch (err) {
			if (err instanceof Error) {
				logger.error("Failed to get current track:", err.stack);
			}
			if (
				err instanceof RequestError &&
				err.response &&
				err.response.statusCode === 429 &&
				err.response.headers &&
				err.response.headers["Retry-After"]
			) {
				const retryAfter = err.response.headers["Retry-After"];
				const retryInSeconds = parseInt(
					(Array.isArray(retryAfter) ? retryAfter[0] : retryAfter) ?? "10",
				);
				refreshCurrentTrackTimer(
					setTimeout(getCurrentTrack, retryInSeconds * 1000),
				);
			} else {
				refreshCurrentTrackTimer(setTimeout(getCurrentTrack, defaultWaitMs));
			}
		}
	};

	const authorize = async (code?: string) => {
		if (!spotifyRep.value) {
			return;
		}

		try {
			if (!code && !spotifyRep.value.refreshToken) {
				logger.error(
					"Tried to authorize, but both code and refreshToken are empty",
				);
				return;
			}
			const authHeader = base64Encode(
				`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`,
			);
			const headers = {
				Authorization: `Basic ${authHeader}`,
				"Content-Type": "application/x-www-form-urlencoded",
			};
			const body = code
				? {
						grant_type: "authorization_code",
						code,
						redirect_uri: redirectUrl,
				  }
				: {
						grant_type: "refresh_token",
						refresh_token: spotifyRep.value.refreshToken,
				  };
			const {
				access_token: accessToken,
				expires_in: expiresIn,
				refresh_token: refreshToken,
			} = await got
				.post("https://accounts.spotify.com/api/token", {
					form: body,
					headers,
				})
				.json<{
					access_token: string;
					expires_in: number;
					refresh_token: string;
				}>();
			if (accessToken) {
				spotifyRep.value.accessToken = accessToken;
			}
			if (refreshToken) {
				spotifyRep.value.refreshToken = refreshToken;
			}
			if (expiresIn) {
				spotifyRep.value.refreshAt = Date.now() + expiresIn * 1000;
			}
			logger.warn(
				`Successfully refreshed token, refreshing in ${expiresIn} seconds`,
			);
			refreshAuthorizeTimer(setTimeout(authorize, expiresIn * 1000));
		} catch (err) {
			if (err instanceof Error) {
				logger.error("Failed to get access token", err.stack);
			}
		}
	};

	nodecg.listenFor("spotify:login", (_, cb) => {
		if (cb && !cb.handled) {
			cb(null, redirectUrl);
		}
	});

	nodecg.listenFor("spotify:authenticated", async (payload) => {
		if (!payload.code) {
			logger.error("User authenticated through Spotify, but missing code");
			return;
		}
		authorize(payload.code);
	});

	if (spotifyRep.value?.refreshAt) {
		const refreshInMs = spotifyRep.value.refreshAt - Date.now();
		logger.warn(`Refreshing token in ${Math.ceil(refreshInMs / 1000)}`);
		setTimeout(authorize, refreshInMs);
	}

	getCurrentTrack();
};
