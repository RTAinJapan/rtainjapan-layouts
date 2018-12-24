import path from 'path';
import * as TsJsonSchema from 'typescript-json-schema';
import writeJson from 'write-json-file';

const typeNames = [
	'Checklist',
	'ChecklistCompleted',
	'CurrentRun',
	'NextRun',
	'GameList',
	'RunnerList',
	'Schedule',
	'Tweets',
	'Twitter',
	'Horaro',
	'Timer',
];

const settings: TsJsonSchema.PartialArgs = {
	ref: true,
	aliasRef: false,
	titles: true,
	noExtraProps: true,
	required: true,
	strictNullChecks: true,
};

const program = TsJsonSchema.getProgramFromFiles([
	path.resolve(__dirname, '../src/lib/replicant/index.ts'),
]);

for (const type of typeNames) {
	const outputPath = path.resolve(__dirname, '../schemas', `${type}.json`);
	const schema = TsJsonSchema.generateSchema(program, type, settings);
	if (!schema) {
		throw new Error(`Schema is empty for type ${type}`);
	}
	writeJson(outputPath, schema)
		.then(() => {
			console.log(`${path.relative(process.cwd(), outputPath)}`);
		})
		.catch(err => {
			console.error(err);
		});
}
