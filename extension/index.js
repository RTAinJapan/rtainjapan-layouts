module.exports = nodecg => {
	require('./checklist')(nodecg);
	require('./schedule')(nodecg);
	require('./timekeeping')(nodecg);
};
