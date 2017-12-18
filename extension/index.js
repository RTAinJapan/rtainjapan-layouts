module.exports = nodecg => {
	require('./checklist')(nodecg);
	require('./schedule')(nodecg);
	require('./timekeeping')(nodecg);
	// require('./twitch-title-updater')(nodecg);
	require('./twitter')(nodecg);
};
