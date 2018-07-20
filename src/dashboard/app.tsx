// Packages
import React from 'react';
import styled from 'styled-components';

// Components
import {Checklist} from './components/checklist';
import {Schedule} from './components/schedule';
import {Timekeeper} from './components/timekeeper';

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	padding: 16px;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
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

export const App = () => (
	<Container>
		<LeftColumn>
			<Timekeeper />
			<Checklist />
		</LeftColumn>
		<Column>
			<Schedule />
		</Column>
		<Column>Fuga</Column>
	</Container>
);
