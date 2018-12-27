import {Compute, JWT, UserRefreshClient} from 'google-auth-library';
import {google} from 'googleapis';

const sheets = google.sheets('v4');

type Auth = Compute | JWT | UserRefreshClient;

export const getAuth = async (clientEmail: string, privateKey: string) => {
	return google.auth.getClient({
		scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
		credentials: {
			client_email: clientEmail,
			private_key: privateKey,
		},
	});
};

export const getData = async (spreadsheetId: string, auth: Auth) => {
	const [{data: rawGames}, {data: rawRunners}] = await Promise.all([
		sheets.spreadsheets.values.get({
			auth,
			spreadsheetId,
			range: 'games',
		}),
		sheets.spreadsheets.values.get({
			auth,
			spreadsheetId,
			range: 'runners',
		}),
	]);
	if (!rawGames.values) {
		throw new Error('Could not fetch data from "games" tab');
	}
	if (!rawRunners.values) {
		throw new Error('Could not fetch data from "runners" tab');
	}
	const runners = rawRunners.values.slice(1).map((value, index) => {
		const id = value[0];
		if (id === undefined) {
			throw new Error(`Runner ${index} does not have ID`);
		}
		return {
			id: String(value[0]),
			name: String(value[1] || ''),
			twitter: String(value[2] || ''),
			nico: String(value[3] || ''),
			twitch: String(value[4] || ''),
		};
	});
	return rawGames.values.slice(1).map((value) => {
		const runnerIds: string = value[5] || '';
		return {
			title: String(value[0] || ''),
			platform: String(value[1] || ''),
			category: String(value[2] || ''),
			runDuration: String(value[3] || ''),
			setupDuration: String(value[4] || ''),
			runners: (runnerIds || '')
				.split(',')
				.filter(Boolean)
				.map((id) => {
					const runner = runners.find((r) => r.id === id);
					if (!runner) {
						throw new Error(`Could not find runner ${id}`);
					}
					return runner;
				}),
		};
	});
};
