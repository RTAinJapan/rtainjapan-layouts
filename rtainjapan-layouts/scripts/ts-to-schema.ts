import path from 'path';
import * as TsJsonSchema from 'typescript-json-schema';
import writeJson from 'write-json-file';
import {ReplicantName} from '../src/replicants';

const settings: TsJsonSchema.PartialArgs = {
	ref: true,
	aliasRef: false,
	titles: true,
	noExtraProps: true,
	required: true,
	strictNullChecks: true,
};

// Replicant schema
{
	const program = TsJsonSchema.getProgramFromFiles([
		path.resolve(__dirname, '../src/replicants/index.ts'),
	]);

	for (const type of Object.keys(ReplicantName)) {
		const outputPath = path.resolve(
			__dirname,
			'../schemas',
			`${type}.json`,
		);
		const schema = TsJsonSchema.generateSchema(program, type, settings);
		if (!schema) {
			throw new Error(`Schema is empty for type ${type}`);
		}
		writeJson(outputPath, schema)
			.then(() => {
				console.log(`${path.relative(process.cwd(), outputPath)}`);
			})
			.catch((err) => {
				console.error(err);
			});
	}
}

// Bundle config schema
{
	const program = TsJsonSchema.getProgramFromFiles([
		path.resolve(__dirname, '../src/bundle-config/index.ts'),
	]);
	const schema = TsJsonSchema.generateSchema(
		program,
		'BundleConfig',
		settings,
	);
	if (!schema) {
		throw new Error(`Schema is empty for BundleConfig`);
	}
	const outputPath = path.resolve(__dirname, '../configschema.json');
	writeJson(outputPath, schema)
		.then(() => {
			console.log(`${path.relative(process.cwd(), outputPath)}`);
		})
		.catch((err) => {
			console.error(err);
		});
}
