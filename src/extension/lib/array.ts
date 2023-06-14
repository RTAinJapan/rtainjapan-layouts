export const filterNonNullable = <T>(arr: T[]) => {
	const filtered = arr.filter(
		(item): item is NonNullable<typeof item> =>
			item !== null && item !== undefined,
	);
	return filtered;
};

export const uniqBy = <T>(array: T[], predicate: (item: T) => unknown) => {
	const seen = new Set();
	return array.filter((item) => {
		const key = predicate(item);
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
};

export const zipObject = <T extends string, U>(
	keys: T[],
	values: U[],
): Record<T, U> => {
	const obj = {} as Record<T, U>;
	keys.forEach((key, index) => {
		obj[key] = values[index] as U;
	});
	return obj;
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
	const result = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
};
