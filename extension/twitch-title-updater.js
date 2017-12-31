const request = require('superagent');
const loginLib = require('../../../lib/login');

module.exports = nodecg => {
	const log = new nodecg.Logger(`${nodecg.bundleName}:twitch`);
	const currentRun = nodecg.Replicant('currentRun');
	const twitchAccessToken = nodecg.Replicant('twitchAccessToken', {
		defaultValue: ''
	});
	const twitchChannelId = nodecg.Replicant('twitchChennelId', {
		defaultValue: ''
	});

	loginLib.on('login', session => {
		const user = session.passport.user;
		if (
			user.provider === 'twitch' &&
			user.username === nodecg.bundleConfig.twitch.target
		) {
			twitchAccessToken.value = user.accessToken;
			twitchChannelId.value = user.id.toString();
			log.info(`Twitch title updater is enabled for ${user.username}`);
		}
	});

	let lastEngTitle;

	currentRun.on('change', updateTwitchTitle);

	/**
	 * Updates Twitch title
	 * @param {Object} newRun Updated new current run
	 */
	function updateTwitchTitle(newRun) {
		if (!twitchAccessToken.value || !twitchChannelId.value) {
			log.info(
				`You must login as ${
					nodecg.bundleConfig.twitch.target
				} to update Twitch status automatically.`
			);
			return;
		}
		if (!newRun.engTitle || newRun.engTitle === lastEngTitle) {
			return;
		}

		log.info(`Updateing Twitch title and game to ${newRun.engTitle}`);
		lastEngTitle = newRun.engTitle;
		const uri = `https://api.twitch.tv/kraken/channels/${
			twitchChannelId.value
		}`;
		const body = {
			channel: {
				status: nodecg.bundleConfig.twitch.titleTemplate.replace(
					/\${gameName}/gi,
					lastEngTitle
				),
				game: lastEngTitle
			}
		};
		request
			.put(uri)
			.send(body)
			.set('Accept', 'application/vnd.twitchtv.v5+json')
			.set('Authorization', `OAuth ${twitchAccessToken.value}`)
			.set('Client-ID', nodecg.config.login.twitch.clientID)
			.set('Content-Type', 'application/json')
			.end(err => {
				if (err) {
					log.error('Failed to update Twitch title and game:');
					log.error(err);
				} else {
					log.info(
						`Succesfully updated Twitch title and game to ${lastEngTitle}`
					);
				}
			});
	}
};
