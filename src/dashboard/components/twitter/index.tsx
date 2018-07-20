import React from 'react';
import styled from 'styled-components';
import {BorderedBox} from '../lib/bordered-box';

const Container = BorderedBox.extend`
	display: grid;
	grid-template-rows: auto 1fr;
	justify-items: stretch;
`;

const Label = styled.div`
	font-weight: 700;
	background-color: #c4c4c4;
	text-align: center;
`;

const Empty = styled.div`
	margin: 16px;
	box-sizing: border-box;
	border: 4px dashed #b7b7b7;
	display: grid;
	align-items: center;
	justify-items: center;
`;

export class Twitter extends React.Component {
	render() {
		return (
			<Container>
				<Label>ツイート表示管理</Label>
				<Empty>表示するツイートがありません</Empty>
			</Container>
		);
	}
}
