type Coor = [number, number];
type BoxCoor = [Coor, Coor, Coor, Coor];

export const makeBoxCoor = (
	x1: number,
	x2: number,
	y1: number,
	y2: number,
): BoxCoor => {
	const x = [x1, x2].sort();
	const y = [y1, y2].sort();
	return [[x[0], y[0]], [x[0], y[1]], [x[1], y[0]], [x[1], y[1]]];
};

export const sortBoxCoor = (boxCoor: BoxCoor): Coor[] => {
	boxCoor.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
	return [boxCoor[0], boxCoor[1], boxCoor[3], boxCoor[2], boxCoor[0]];
};

export const makeCoors = (
	width: number,
	height: number,
	...boxCoors: Coor[][]
): Coor[] => {
	boxCoors.sort((a, b) => a[0][0] - b[0][0]);
	const res: Coor[] = [[0, 0]];
	for (const boxCoor of boxCoors) {
		const entry: Coor = [boxCoor[0][0], 0];
		res.push(entry, ...boxCoor, entry);
	}
	res.push([width, 0], [width, height], [0, height], [0, 0]);
	return res;
};

export const outputCss = (coors: Coor[]) => {
	const polygon = coors
		.map((coor) => coor.map((n) => `${n}px`).join(' '))
		.join(', ');
	const css = `clip-path: polygon(${polygon});`;
	return css;
};
