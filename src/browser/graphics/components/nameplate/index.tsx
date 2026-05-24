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
	// runners / commentators 共通で「対象の人物が喋っているか」を取り、
	// 各 UI 側で nameplate 全体ではなくアイコンの色を切り替える。
	const active = useAudioActive(kind, index);

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
		glow: active,
	});
};
