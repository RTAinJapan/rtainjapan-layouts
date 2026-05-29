import {Commentator} from "../../../../nodecg/replicants";
import {useReplicant} from "../../../use-replicant";

export const useCurrentRun = () => {
	const currentRun = useReplicant("current-run");
	return currentRun;
};

export const useSchedule = () => {
	const schedule = useReplicant("schedule");
	return schedule;
};

export const useTimer = () => {
	const timer = useReplicant("timer");
	return timer;
};

export const useAudioActive = (
	kind: "runners" | "commentators",
	index: number,
) => {
	const audioActive = useReplicant("audio-active");
	if (!audioActive) {
		return false;
	}
	return audioActive[kind]?.[index] ?? false;
};

// 走者 index のゲーム音が配信 Main に乗っているか (on-air)。
// runner と同じ index で audio-active.games を引く。
export const useGameOnAir = (index: number) => {
	const audioActive = useReplicant("audio-active");
	if (!audioActive) {
		return false;
	}
	return audioActive.games?.[index] ?? false;
};

export const useCommentators = () => {
	const currentRun = useCurrentRun();
	if (!currentRun) {
		return [];
	}
	const commentators: Commentator[] = [];
	for (const commentator of currentRun.commentators) {
		if (commentator && commentator.name) {
			commentators.push(commentator);
		}
	}
	return commentators;
};
