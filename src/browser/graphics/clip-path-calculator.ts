type Coor = [number, number];
type BoxCoor = [Coor, Coor, Coor, Coor];

const makeBoxCoor = (
	x1: number,
	x2: number,
	y1: number,
	y2: number,
): BoxCoor => {
	return [
		[x1, y1],
		[x1, y2],
		[x2, y1],
		[x2, y2],
	];
};

const sortBoxCoor = (boxCoor: BoxCoor): Coor[] => {
	boxCoor.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
	return [boxCoor[0], boxCoor[1], boxCoor[3], boxCoor[2], boxCoor[0]];
};

const makeCoors = (
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

const outputCss = (coors: Coor[]) => {
	const polygon = coors
		.map((coor) => coor.map((n) => `${n}px`).join(' '))
		.join(', ');
	const css = `clip-path: polygon(${polygon});`;
	return css;
};

export const calculateClipPath = (
	xxyy: Array<[number, number, number, number]>,
) => {
	return outputCss(
		makeCoors(1920, 1080, ...xxyy.map((a) => sortBoxCoor(makeBoxCoor(...a)))),
	);
};
