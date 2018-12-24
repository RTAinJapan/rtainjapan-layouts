import child_process from 'child_process';
import del from 'del';
import fs from 'fs';
import path from 'path';

const resolvePath = (...paths: string[]) => path.resolve(__dirname, ...paths);

const bowerPath = resolvePath('../node_modules/.bin/bower');
const nodecgPath = resolvePath('../node_modules/nodecg');

const setupBundle = async () => {
	const target = resolvePath(nodecgPath, 'bundles/rtainjapan-layouts');
	await del(target);
	await fs.promises.symlink('../../../rtainjapan-layouts', target, 'dir');
};
const setupCfg = async () => {
	const target = resolvePath(nodecgPath, 'cfg');
	await del(target);
	await fs.promises.symlink('../../cfg', target, 'dir');
};
const setupDb = async () => {
	const target = resolvePath(nodecgPath, 'db');
	await del(target);
	await fs.promises.symlink('../../db', target, 'dir');
};

setupBundle();
setupCfg();
setupDb();
child_process.fork(bowerPath, ['install', '--production', '--allow-root'], {
	cwd: nodecgPath,
});
