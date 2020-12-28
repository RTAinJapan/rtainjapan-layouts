import {css} from 'styled-components';

export type X = number;
export type Y = number;
export type Coordinate = [X, Y];
export type BoxCornerCoordinates = [
	Coordinate,
	Coordinate,
	Coordinate,
	Coordinate,
];
export type Box = [X, X, Y, Y];

const calcCorners = ([x1, x2, y1, y2]: Box) => {
	const boxCorners: BoxCornerCoordinates = [
		[x1, y1],
		[x1, y2],
		[x2, y1],
		[x2, y2],
	];
	boxCorners.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
	return [
		boxCorners[0],
		boxCorners[1],
		boxCorners[3],
		boxCorners[2],
		boxCorners[0],
	];
};

export const calculateClipPath = (boxes: Box[]) => {
	const boxCornersList = boxes.map((box) => calcCorners(box));
	boxCornersList.sort((a, b) => a[0][0] - b[0][0]);
	const clipPath: Coordinate[] = [[0, 0]];
	for (const boxCorners of boxCornersList) {
		const entryCoordinate: Coordinate = [boxCorners[0][0], 0];
		clipPath.push(entryCoordinate, ...boxCorners, entryCoordinate);
	}
	clipPath.push([1920, 0], [1920, 1080], [0, 1080], [0, 0]);
	return css`
		clip-path: polygon(
			${clipPath.map((coor) => coor.map((n) => `${n}px`).join(' ')).join(',')}
		);
	`;
};
