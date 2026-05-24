import {useCurrentRun, useTimer, useAudioActive} from "../lib/hooks";
import {Timer} from "../../../../nodecg/replicants";
import {TwoRowNameplate, TwoRowProps} from "./ui/two-row";
import {SingleRowNameplate} from "./ui/single-row";

type GenericProps = {
	kind: "runners" | "commentators";
	index?: number;
	style?: React.CSSProperties;
	race?: boolean;
};

type Props = GenericProps &
	(({variant?: "two-row"} & TwoRowProps) | {variant: "single"});

export const NamePlate = ({
	variant = "two-row",
	index = 0,
	kind,
	race = false,
	...props
}: Props) => {
	const currentRun = useCurrentRun();
	const timer = useTimer();
	// runner の場合のみ、その index の音量アクティブ状態を見る
	const active = useAudioActive(kind === "runners" ? index : -1);

	if (!currentRun || !timer) {
		return null;
	}

	const result =
		kind === "runners" && typeof index === "number" && race
			? (timer.results[index] as Timer | undefined)
			: null;

	const nameplate =
		variant === "two-row" ? TwoRowNameplate : SingleRowNameplate;

	// 音量が一定以上なら発光させるスタイル
	const glowStyle: React.CSSProperties =
		kind === "runners" && active
			? {
					boxShadow: "0 0 16px 2px #7fd6ff, 0 0 4px 1px #7fd6ff inset",
					transition: "box-shadow 0.12s ease-out",
			  }
			: {transition: "box-shadow 0.25s ease-out"};

	const mergedStyle = {
		...glowStyle,
		...(props as {style?: React.CSSProperties}).style,
	};

	return nameplate({
		kind,
		person: currentRun[kind][index] ?? undefined,
		result: result ?? undefined,
		race,
		...props,
		style: mergedStyle,
	});
};
