import {isEqual} from 'lodash';
import got from 'got';
import {NodeCG} from './nodecg';

const defaultWaitMs = 5 * 1000;

const sumArtists = (artists: Array<{name: string}>) => {
	return artists.map((artist) => artist.name).join(', ');
};

const base64Encode = (str: string) => {
	return Buffer.from(str).toString('base64');
};

export const spotify = async (nodecg: NodeCG) => {
	const logger = new nodecg.Logger('spotify');
	const spotifyConfig = nodecg.bundleConfig.spotify;
	if (!spotifyConfig) {
		logger.warn('Spotify config is empty');
		return;
	}

	const spotifyRep = nodecg.Replicant('spotify', {defaultValue: {}});
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
		try {
			const token = spotifyRep.value.accessToken;
			if (!token) {
				refreshCurrentTrackTimer(
					setTimeout(getCurrentTrack, defaultWaitMs),
				);
				return;
			}
			const res = await got.get(
				'https://api.spotify.com/v1/me/player/currently-playing',
				{
					json: true,
					query: {
						market: 'from_token',
					},
					headers: {Authorization: `Bearer ${token}`},
				},
			);
			if (res.statusCode === 204) {
				spotifyRep.value.currentTrack = undefined;
				refreshCurrentTrackTimer(
					setTimeout(getCurrentTrack, defaultWaitMs),
				);
				return;
			}
			const newTrack = {
				name: res.body.item.name,
				artists: sumArtists(res.body.item.artists),
				album: res.body.item.album.name,
			};
			if (!isEqual(newTrack, spotifyRep.value.currentTrack)) {
				logger.info(`Now playing: ${newTrack.name}`);
				spotifyRep.value.currentTrack = newTrack;
			}
			refreshCurrentTrackTimer(
				setTimeout(getCurrentTrack, defaultWaitMs),
			);
		} catch (err) {
			logger.error('Failed to get current track:', err.stack);
			if (
				err.response &&
				err.response.status === 429 &&
				err.response.headers &&
				err.response.headers['Retry-After']
			) {
				const retryInSeconds = err.response.headers['Retry-After'];
				refreshCurrentTrackTimer(
					setTimeout(getCurrentTrack, retryInSeconds * 1000),
				);
			} else {
				refreshCurrentTrackTimer(
					setTimeout(getCurrentTrack, defaultWaitMs),
				);
			}
		}
	};

	const authorize = async (code?: string) => {
		try {
			if (!code && !spotifyRep.value.refreshToken) {
				logger.error(
					'Tried to authorize, but both code and refreshToken are empty',
				);
				return;
			}
			const authHeader = base64Encode(
				`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`,
			);
			const headers = {
				Authorization: `Basic ${authHeader}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			};
			const body = code
				? {
						grant_type: 'authorization_code',
						code,
						redirect_uri: redirectUrl,
				  }
				: {
						grant_type: 'refresh_token',
						refresh_token: spotifyRep.value.refreshToken,
				  };
			const res = await got.post(
				'https://accounts.spotify.com/api/token',
				{form: true, body, headers},
			);
			const {
				access_token: accessToken,
				expires_in: expiresIn,
				refresh_token: refreshToken,
			} = JSON.parse(res.body);
			if (accessToken) {
				spotifyRep.value.accessToken = accessToken;
			}
			if (refreshToken) {
				spotifyRep.value.refreshToken = refreshToken;
			}
			if (expiresIn) {
				spotifyRep.value.refreshAt = Date.now() + expiresIn * 1000;
			}
			logger.info(
				`Successfully refreshed token, refreshing in ${expiresIn} seconds`,
			);
			refreshAuthorizeTimer(setTimeout(authorize, expiresIn * 1000));
		} catch (err) {
			logger.error('Failed to get access token', err.stack);
		}
	};

	nodecg.listenFor('spotify:login', (_, cb) => {
		if (cb && !cb.handled) {
			cb(null, redirectUrl);
		}
	});

	nodecg.listenFor('spotify:authenticated', async (payload) => {
		if (!payload.code) {
			logger.error(
				'User authenticated through Spotify, but missing code',
			);
			return;
		}
		authorize(payload.code);
	});

	if (spotifyRep.value.refreshAt) {
		const refreshInMs = spotifyRep.value.refreshAt - Date.now();
		logger.info(`Refreshing token in ${Math.ceil(refreshInMs / 1000)}`);
		setTimeout(authorize, refreshInMs);
	}

	getCurrentTrack();
};
