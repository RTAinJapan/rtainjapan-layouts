import {CreateNodecgConstructor, CreateNodecgInstance} from "ts-nodecg/browser";
import TNodeCG from "@nodecg/types";

type CoreReplicantMap = {
	"graphics:instances": TNodeCG.GraphicsInstance[];
};

type CoreNodecgInstance = CreateNodecgInstance<
	"nodecg",
	{},
	CoreReplicantMap,
	{},
	true
>;
type CoreNodecgConstructor = CreateNodecgConstructor<
	"nodecg",
	{},
	CoreReplicantMap,
	{},
	true
>;

export const coreNodecg = nodecg as unknown as CoreNodecgInstance;
export const CoreNodeCG = NodeCG as unknown as CoreNodecgConstructor;

export const existGraphicsSocket = (
	bundleName: string,
	graphicName: string,
): boolean => {
	const instanceRep = coreNodecg.Replicant("graphics:instances", "nodecg");

	if (!instanceRep.value) {
		return false;
	}

	const pathnameEndsWith = `/${bundleName}/graphics/${graphicName}`;

	return instanceRep.value.some((instance) =>
		instance.pathName.endsWith(pathnameEndsWith),
	);
};
