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

export const useCommentators = () => {
	const currentRun = useCurrentRun();
	return currentRun?.commentators.filter((person) => person.name) ?? [];
};
