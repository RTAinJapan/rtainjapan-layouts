// Packages
import React from 'react';
import styled from 'styled-components';

// Components
import {Checklist} from './components/checklist';
import {Schedule} from './components/schedule';

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	padding: 16px;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 20px;
`;

const Column = styled.div`
	height: 100%;
	display: grid;
	gap: 16px;
`;
const LeftColumn = Column.extend`
	grid-template-rows: 1fr auto;
`;

const Bordered = styled.div`
	box-sizing: border-box;
	background: white;
	border: 1px solid black;
`;

export const App = () => (
	<Container>
		<LeftColumn>
			<Bordered>
				<Schedule />
			</Bordered>
			<Bordered>
				<Checklist />
			</Bordered>
		</LeftColumn>
		<Column>Hoge</Column>
		<Column>Fuga</Column>
	</Container>
);
