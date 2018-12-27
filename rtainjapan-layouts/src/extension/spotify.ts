import axios from 'axios';
import loadJson from 'load-json-file';
import {NodeCG} from 'nodecg/types/server';
import path from 'path';
import writeJson from 'write-json-file';
import BundleConfig from '../bundle-config';
import {ReplicantName as R, Spotify} from '../replicants';

const defaultWaitMs = 30 * 1000;
const bufferMs = 1000;

const accessTokenPath = path.resolve(__dirname, 'db/spotify-access-token.json');
const writeAccessToken = async (token: string) => {
	await writeJson(accessTokenPath, token);
};
const loadAccessToken = async () => {
	const accessToken = await loadJson(accessTokenPath);
	if (typeof accessToken !== 'string') {
		throw new Error(
			`Invalid type of Spotify access token from DB: ${typeof accessToken}`,
		);
	}
	return accessToken;
};

const sumArtists = (artists: Array<{name: string}>) => {
	return artists.map((artist) => artist.name).join(', ');
};

export const spotify = async (nodecg: NodeCG) => {
	const bundleCfg = nodecg.bundleConfig as BundleConfig;
	const spotifyRep = nodecg.Replicant<Spotify>(R.Spotify, {defaultValue: {}});

	// prettier-ignore
	const redirectUrl = `http://${nodecg.config.baseURL}/bundles/${nodecg.bundleName}/spotify-callback/index.html`;

	const currentTrackUrl = new URL(
		'v1/me/player/currently-playing',
		'https://api.spotify.com',
	);
	currentTrackUrl.searchParams.set('market', 'from_token');
	let currentTrackTimer: NodeJS.Timer | undefined;
	const refreshTimer = (timer: NodeJS.Timer) => {
		if (currentTrackTimer) {
			clearTimeout(currentTrackTimer);
		}
		currentTrackTimer = timer;
	};
	const getCurrentTrack = async () => {
		const token = await loadAccessToken();
		if (!token) {
			return;
		}
		try {
			const res = await axios.get(currentTrackUrl.href, {
				headers: {Authorization: `Bearer ${token}`},
			});
			if (res.status === 204) {
				spotifyRep.value.currentTrack = undefined;
				refreshTimer(setTimeout(getCurrentTrack, defaultWaitMs));
				return;
			}
			const name = res.data.item.name;
			const artists = sumArtists(res.data.item.artists);
			console.log({name, artists});
			spotifyRep.value = {currentTrack: {name, artists}};
			const remainMs = res.data.item.duration_ms - res.data.progress_ms;
			refreshTimer(setTimeout(getCurrentTrack, remainMs + bufferMs));
		} catch (err) {
			console.error(err);
			if (
				err.response &&
				err.response.status === 429 &&
				err.response.headers &&
				err.response.headers['Retry-After']
			) {
				const waitMs = err.response.headers['Retry-After'];
				refreshTimer(setTimeout(getCurrentTrack, waitMs));
			} else {
				refreshTimer(setTimeout(getCurrentTrack, defaultWaitMs));
			}
		}
	};

	nodecg.listenFor('spotify:login', (_, cb) => {
		if (cb && !cb.handled) {
			cb(null, redirectUrl);
		}
	});

	nodecg.listenFor(
		'spotify:authenticated',
		async (payload: {code: string | null}) => {
			console.log('hello!');
			if (!payload.code) {
				nodecg.log.error(
					'User authenticated through Spotify, but missing code',
				);
				return;
			}
			try {
				const tokenReqUrl = new URL(
					'api/token',
					'https://accounts.spotify.com',
				);
				const params = new URLSearchParams();
				params.set('grant_type', 'authorization_code');
				params.set('code', payload.code);
				params.set('redirect_uri', redirectUrl);
				const authHeader = Buffer.from(
					// prettier-ignore
					`${bundleCfg.spotify.clientId}:${bundleCfg.spotify.clientSecret}`,
				).toString('base64');
				const headers = {
					Authorization: `Basic ${authHeader}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				};
				const res = await axios
					.post(tokenReqUrl.href, params, {
						headers,
					})
					.catch((err) => {
						console.log(err.response.data);
						throw err;
					});
				const accessToken: unknown = res.data.access_token;
				if (typeof accessToken !== 'string') {
					nodecg.log.error('Access token from Spotify is not string');
					return;
				}
				await writeAccessToken(accessToken);
				// TODO: refresh
				await getCurrentTrack();
			} catch (err) {
				nodecg.log.error(
					`Error duing token request for Spotify: ${err.stack}`,
				);
			}
		},
	);

	// Try to load token and create one if there is none
	try {
		await loadAccessToken();
		getCurrentTrack();
	} catch (_) {
		await writeAccessToken('');
	}
};
