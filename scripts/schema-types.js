const fs = require('fs');
const path = require('path');
const util = require('util');
const {compileFromFile} = require('json-schema-to-typescript');
const appRoot = require('app-root-path');

const writeFilePromise = util.promisify(fs.writeFile);

const outDir = appRoot.resolve('types/schemas');
const schemasDir = appRoot.resolve('schemas');
const schemas = fs.readdirSync(schemasDir).filter(f => f.endsWith('.json'));

const compile = (input, output, cwd = appRoot.path) =>
	compileFromFile(input, {
		cwd,
		declareExternallyReferenced: true,
		enableConstEnums: true,
	})
		.then(ts => writeFilePromise(output, ts))
		.then(() => {
			console.log(output)
		})
		.catch(err => {
			console.error(err);
		});

compile(
	appRoot.resolve('configschema.json'),
	path.resolve(outDir, 'configschema.d.ts')
);

for (const schema of schemas) {
	compile(
		path.resolve(schemasDir, schema),
		path.resolve(outDir, schema.replace(/\.json$/i, '.d.ts')),
		schemasDir
	);
}
