import {useEffect, useState} from "react";
import {ReplicantMap} from "../nodecg/replicants";
import {klona as clone} from "klona/json";

/**
 * Subscribe to a replicant, returns tuple of the replicant value and `setValue` function.
 * The component using this function gets re-rendered when the value is updated.
 * The `setValue` function can be used to update replicant value.
 * @param replicant Replicant object to subscribe to
 */
export const useReplicant = <TRepName extends keyof ReplicantMap>(
	replicantName: TRepName,
) => {
	const replicant = nodecg.Replicant(replicantName);
	const [value, updateValue] = useState<ReplicantMap[TRepName] | null>(null);

	useEffect(() => {
		const changeHandler = (newValue: ReplicantMap[TRepName]): void => {
			updateValue((oldValue) => {
				if (newValue !== oldValue) {
					return newValue;
				}
				return clone(newValue);
			});
		};
		replicant.on("change", changeHandler);
		return () => {
			replicant.removeListener("change", changeHandler);
		};
	}, [replicant]);

	return value;
};
