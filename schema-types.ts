import fs from 'fs';
import path from 'path';
import util from 'util';
import {compileFromFile} from 'json-schema-to-typescript';

const writeFilePromise = util.promisify(fs.writeFile);
const outDir = path.resolve(__dirname, './types/schemas');
const compile = (input: string, output: string) =>
	compileFromFile(input)
		.then(ts => writeFilePromise(output, ts))
		.catch(err => {
			console.error(err);
		});

compile(
	path.resolve(__dirname, 'configschema.json'),
	path.resolve(outDir, 'configschema.d.ts')
);

const schemasDir = path.resolve(__dirname, './schemas');
const schemas = fs.readdirSync(schemasDir).filter(f => f.endsWith('.json'));
for (const schema of schemas) {
	compile(
		path.resolve(schemasDir, schema),
		path.resolve(outDir, schema.replace(/\.json/i, '.d.ts'))
	);
}
