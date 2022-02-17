export const clipRect = (
	rects: {top: number; left: number; width: number; height: number}[],
) => {
	const polygon = rects
		.map(({top, left, width, height}) => {
			return [
				[0, top],
				[left + width, top],
				[left + width, top + height],
				[left, top + height],
				[left, top],
				[0, top],
			]
				.map((coordinate) => `${coordinate[0]}px ${coordinate[1]}px`)
				.join(",");
		})
		.join(",");
	return `polygon(0px 0px, ${polygon}, 0px 0px)`;
};
