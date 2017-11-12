module.exports = nodecg => {
	require('./schedule')(nodecg);
	require('./timekeeping')(nodecg);
};
