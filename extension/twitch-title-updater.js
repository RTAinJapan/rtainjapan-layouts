const request = require('superagent');

module.exports = nodecg => {
	const log = new nodecg.Logger(`${nodecg.bundleName}:twitch`);
	const currentRun = nodecg.Replicant('currentRun');

	let lastEngTitle;

	currentRun.on('change', updateTwitchTitle);

	/**
	 * Updates Twitch title
	 * @param {Object} newRun Updated new current run
	 */
	function updateTwitchTitle(newRun) {
		if (newRun.engTitle === lastEngTitle) {
			return;
		}

		log.info(`Updateing Twitch title and game to ${newRun.engTitle}`);
		lastEngTitle = newRun.engTitle;
		const uri = `https://api.twitch.tv/kraken/channels/${
			nodecg.bundleConfig.twitch.channelId
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
			.patch(uri)
			.send(body)
			.set('Accept', 'application/vnd.twitchtv.v5+json')
			.set('Authorization', `OAuth ${nodecg.bundleConfig.twitch.oauthToken}`)
			.set('Client-ID', nodecg.bundleConfig.twitch.clientId)
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
