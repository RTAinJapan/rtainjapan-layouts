import {Commentator, Runner, Timer} from "../../../../../nodecg/replicants";

export type CommonProps = {
	kind: "runners" | "commentators";
	person: Runner | Commentator | undefined;
	result: Timer | undefined;
	race: boolean;
	style?: React.CSSProperties;
};

export type NameplateProps<T> = CommonProps & T;
