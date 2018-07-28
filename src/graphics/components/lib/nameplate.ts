import styled from 'styled-components';

export const Container = styled.div`
	font-weight: 900;
`;

export const SubContainer = styled.div`
	position: absolute;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-end;
	height: 36px;
	top: 15px;
	left: 15px;
`;

export const Ruler = styled.div`
	position: absolute;
	width: 100%;
	height: 3px;
	bottom: 0px;
	background-color: #ffff52;
`;

export const LabelIcon = styled.img`
	margin-right: 15px;
`;

export const Label = styled.div`
	margin: 0 30px 0 0;
	font-size: 24px;
`;

export const Name = styled.div`
	margin: 0 30px 0 0;
	font-size: 36px;
`;

export const SocialInfo = styled.div`
	font-size: 24px;
	margin-left: 7.5px;
	font-weight: 400;
`;

export const FinishTime = styled.div`
	position: absolute;
	right: 15px;
	bottom: 8px;
	color: #ffff52;
	opacity: 0;
	transition: opacity 0.33s linear;
	font-size: 30px;
`;
