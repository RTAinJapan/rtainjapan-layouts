export const filterNonNullable = <T>(arr: T[]) => {
	const filtered = arr.filter(
		(item): item is NonNullable<typeof item> =>
			item !== null && item !== undefined,
	);
	return filtered;
};
