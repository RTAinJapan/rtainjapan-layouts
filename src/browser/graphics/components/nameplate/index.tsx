import {useCurrentRun, useTimer} from "../lib/hooks";
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
	});
};
