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

	return nameplate({
		kind,
		person: currentRun[kind][index] ?? undefined,
		result: result ?? undefined,
		race,
		...props,
		// 発光は実際の枠 (single-row では outer div、two-row では inner pill) に
		// 適用するため、各 UI 側で boxShadow を当てる。
		glow: kind === "runners" && active,
	});
};
