import styled, {css} from 'styled-components';

export const Container = styled.div`
	position: absolute;
	overflow: hidden;
	width: 1920px;
	height: 1080px;
`;

export const GradientRight = css`
	background: linear-gradient(
		to right,
		rgba(0, 10, 60, 0.6) 10%,
		rgba(0, 10, 60, 0.05) 100%
	);
`;

export const GradientCentre = css`
	background: linear-gradient(
		to right,
		rgba(0, 10, 60, 0.05) 0%,
		rgba(0, 10, 60, 0.6) 45%,
		rgba(0, 10, 60, 0.6) 55%,
		rgba(0, 10, 60, 0.05) 100%
	);
`;
