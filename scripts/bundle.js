const {fork} = require('child_process');

const isProduction = process.env.NODE_ENV === 'production';
const command = isProduction ? 'build' : 'watch';
const detailedReport = isProduction ? ['--detailed-report'] : [];

fork('./node_modules/.bin/parcel', [
	command,
	'src/extension/index.ts',
	'--target',
	'node',
	'--out-dir',
	'extension',
	'--public-url',
	'./',
	...detailedReport,
])

fork('./node_modules/.bin/parcel', [
	command,
	'src/dashboard/*.html',
	'--out-dir',
	'dashboard',
	'--public-url',
	'./',
	...detailedReport,
])

fork('./node_modules/.bin/parcel', [
	command,
	'src/twitter-callback/*.html',
	'--out-dir',
	'twitter-callback',
	'--public-url',
	'./',
	...detailedReport,
])
