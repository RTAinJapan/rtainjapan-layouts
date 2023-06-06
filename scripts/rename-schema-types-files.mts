import * as fs from "node:fs/promises";
import {globby} from "globby";

await fs.rm("./src/nodecg/generated/index.d.ts");

const typesFiles = await globby("./src/nodecg/generated/*.d.ts");

await Promise.all(
	typesFiles.map((file) => fs.rename(file, file.replace(/\.d\.ts$/, ".ts"))),
);
