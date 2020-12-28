import styled, {css} from 'styled-components';
import {Box, calculateClipPath} from '../../clip-path-calculator';

const {colorTheme} = nodecg.bundleConfig;

interface ContainerProps {
	backgroundImage: string | null;
	clipBoxes: Box[];
}
export const Container = styled.div`
	position: absolute;
	overflow: hidden;
	width: 1920px;
	height: 1080px;

	${(props: ContainerProps) => css`
		background-image: url(${props.backgroundImage});
	`}
	${(props: ContainerProps) => calculateClipPath(props.clipBoxes)}
`;

export const GradientRight =
	colorTheme === 'blue'
		? css`
				background: linear-gradient(
					to right,
					rgba(0, 10, 60, 0.6) 10%,
					rgba(0, 10, 60, 0.05) 100%
				);
		  `
		: css`
				background: linear-gradient(
					to right,
					rgba(27, 20, 8, 0.6) 10%,
					rgba(27, 20, 8, 0.05) 100%
				);
		  `;

export const GradientCentre =
	colorTheme === 'blue'
		? css`
				background: linear-gradient(
					to right,
					rgba(0, 10, 60, 0.05) 0%,
					rgba(0, 10, 60, 0.6) 45%,
					rgba(0, 10, 60, 0.6) 55%,
					rgba(0, 10, 60, 0.05) 100%
				);
		  `
		: css`
				background: linear-gradient(
					to right,
					rgba(27, 20, 8, 0.05) 0%,
					rgba(27, 20, 8, 0.6) 45%,
					rgba(27, 20, 8, 0.6) 55%,
					rgba(27, 20, 8, 0.05) 100%
				);
		  `;
