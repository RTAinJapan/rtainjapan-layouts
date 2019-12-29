import {useEffect, useState} from 'react';
import _ from 'lodash';
import {Replicant} from 'ts-nodecg/browser';

import {ReplicantMap} from '../nodecg/replicants';

/**
 * Subscribe to a replicant, returns tuple of the replicant value and `setValue` function.
 * The component using this function gets re-rendered when the value is updated.
 * The `setValue` function can be used to update replicant value.
 * @param replicant Replicant object to subscribe to
 * @param initialValue Initial value to pass to `useState` function
 */
export const useReplicant = <
	TBundleName extends string,
	TRepMap extends ReplicantMap,
	TRepName extends keyof ReplicantMap,
	TSchema extends TRepMap[TRepName]
>(
	replicant: Replicant<TBundleName, TRepMap, TRepName, TSchema | undefined>,
): [TSchema | null, (newValue: TSchema) => void] => {
	const [value, updateValue] = useState<TSchema | null>(null);

	const changeHandler = (newValue: TSchema): void => {
		updateValue((oldValue) => {
			if (newValue !== oldValue) {
				return newValue;
			}
			if (_.isEqual(oldValue, newValue)) {
				return oldValue;
			}
			return _.clone(newValue);
		});
	};

	useEffect(() => {
		replicant.on('change', changeHandler as any);
		return () => {
			replicant.removeListener('change', changeHandler as any);
		};
	}, [replicant]);

	return [
		value,
		(newValue) => {
			replicant.value = newValue;
		},
	];
};
