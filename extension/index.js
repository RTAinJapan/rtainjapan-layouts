const request = require('superagent');

module.exports = function (nodecg) {
	request
		.get(`https://horaro.org/-/api/v1/schedules/${nodecg.bundleConfig.horaro.scheduleId}`)
		.end((err, res) => {
			if (err) {
				nodecg.log.error(err);
			} else {
				console.log(res.body.data.items[0]);
			}
		});
};
