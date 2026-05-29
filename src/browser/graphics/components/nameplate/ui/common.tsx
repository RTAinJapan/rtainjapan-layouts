import {Commentator, Runner, Timer} from "../../../../../nodecg/replicants";

export type CommonProps = {
	kind: "runners" | "commentators";
	person: Runner | Commentator | undefined;
	result: Timer | undefined;
	race: boolean;
	style?: React.CSSProperties;
	/** WING のマイク音量検知でマイクアイコンを発光させる */
	glow?: boolean;
	/** ゲーム音が配信 Main に乗っているとき (on-air)、走者枠のサウンドアイコンを発光させる (race のみ) */
	gameOnAir?: boolean;
};

export type NameplateProps<T> = CommonProps & T;
