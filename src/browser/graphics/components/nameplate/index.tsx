import {
	useCurrentRun,
	useTimer,
	useAudioActive,
	useGameOnAir,
} from "../lib/hooks";
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
	// runners / commentators 共通で「対象の人物が喋っているか」(マイク) を取り、
	// 各 UI 側でマイクアイコンの色を切り替える。
	const active = useAudioActive(kind, index);
	// 走者は「ゲーム音が配信に乗っているか」(on-air) も取り、サウンドアイコンを
	// 別軸で発光させる (表示は race layout のみ、UI 側で gate)。
	const gameOnAir = useGameOnAir(index);

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
		gameOnAir: kind === "runners" ? gameOnAir : false,
	});
};
