import {Commentator, Runner, Timer} from "../../../../../nodecg/replicants";

export type CommonProps = {
	kind: "runners" | "commentators";
	person: Runner | Commentator | undefined;
	result: Timer | undefined;
	race: boolean;
	style?: React.CSSProperties;
	/** WING の音量検知で名前枠を発光させる */
	glow?: boolean;
};

export type NameplateProps<T> = CommonProps & T;
