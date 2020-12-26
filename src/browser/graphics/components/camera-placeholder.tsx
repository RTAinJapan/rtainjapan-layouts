import styled from 'styled-components';
import noCameraImg from '../images/icon/no-camera.png';

export const CameraPlaceholder = styled.div`
	z-index: 10;
	background: url(${noCameraImg}), rgb(44, 24, 16);
	background-position: center;
	background-repeat: no-repeat;
`;
