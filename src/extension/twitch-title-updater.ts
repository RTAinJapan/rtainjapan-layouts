import axios from 'axios';
import {NodeCG} from '../types/nodecg';
import {CurrentRun} from '../types/schemas/currentRun';

export const twitchTitleUpdater = (nodecg: NodeCG) => {
	const log = new nodecg.Logger(`${nodecg.bundleName}:twitch`);
	const currentRun = nodecg.Replicant<CurrentRun>('currentRun');
	const twitchAccessToken = nodecg.Replicant('twitchAccessToken', {
		defaultValue: '',
	});
	const twitchChannelId = nodecg.Replicant('twitchChennelId', {
		defaultValue: '',
	});

	if (
		!nodecg.config.login ||
		!nodecg.config.login.enabled ||
		!nodecg.config.login.twitch ||
		!nodecg.config.login.twitch.enabled
	) {
		log.info(
			"Enable NodeCG's login feature to enable Twitch title updater"
		);
		return;
	}

	const hasEditorScope = nodecg.config.login.twitch.scope
		.split(' ')
		.includes('channel_editor');
	if (!hasEditorScope) {
		log.info(
			'Include channel_editor scope for the Twitch authentication to enable Twitch title updater'
		);
		return;
	}

	const loginLib = require('../../../../lib/login');
	loginLib.on('login', (session: any) => {
		const user = session.passport.user;
		if (
			user.provider !== 'twitch' ||
			user.username !== nodecg.bundleConfig.twitch.targetChannel
		) {
			return;
		}
		twitchAccessToken.value = user.accessToken;
		twitchChannelId.value = user.id.toString();
		log.info(`Twitch title updater is enabled for ${user.username}`);
	});

	let lastTitle: string;
	let lastEngTitle: string;
	currentRun.on('change', updateTwitchTitle);

	/**
	 * Updates Twitch title
	 * @param newRun Updated new current run
	 */
	function updateTwitchTitle(newRun: CurrentRun) {
		if (!twitchAccessToken.value || !twitchChannelId.value) {
			log.info(
				`You must login as ${
					nodecg.bundleConfig.twitch.targetChannel
				} to update Twitch status automatically.`
			);
			return;
		}
		if (
			!newRun.engTitle ||
			(newRun.engTitle === lastEngTitle && newRun.title === lastTitle)
		) {
			return;
		}

		log.info(`Updateing Twitch title and game to ${newRun.engTitle}`);
		lastTitle = newRun.title || '';
		lastEngTitle = newRun.engTitle;
		const uri = `https://api.twitch.tv/kraken/channels/${
			twitchChannelId.value
		}`;
		const body = {
			channel: {
				status: nodecg.bundleConfig.twitch.titleTemplate.replace(
					/\${gameName}/gi,
					lastTitle
				),
				game: lastEngTitle,
			},
		};
		axios
			.put(uri, body, {
				headers: {
					Accept: 'application/vnd.twitchtv.v5+json',
					Authorization: `OAuth ${twitchAccessToken.value}`,
					'Client-ID': nodecg.config.login.twitch.clientID,
					'Content-Type': 'application/json',
				},
			})
			.then(() => {
				log.info(
					`Succesfully updated Twitch title and game to ${lastEngTitle}`
				);
			})
			.catch(err => {
				log.error('Failed to update Twitch title and game:');
				log.error(err);
			});
	}
};
