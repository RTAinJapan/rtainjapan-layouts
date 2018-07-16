import React from 'react';
import styled from 'styled-components';
import {Checklist} from './components/checklist';

const Wrapper = styled.div`
	width: 100vw;
`;
const Container = styled.div`
	padding: 15px 20px;
	box-sizing: border-box;
	flex-shrink: 0;
	flex-grow: 1;
`;
const Column = styled.div`
	width: 560px;
	margin: 0 20px;
`;
const Bordered = styled.div`
	box-sizing: border-box;
	background: white;
	border: 1px solid black;
`;

export const App = () => (
	<Wrapper>
		<Container>
			<Column>
				<Bordered>
					<Checklist />
				</Bordered>
			</Column>
			<Column />
			<Column />
		</Container>
	</Wrapper>
);
