import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-end;
	align-items: center;
	color: white;
	white-space: nowrap;
	background: linear-gradient(
		to right,
		rgba(2, 14, 21, 0.05) 0%,
		rgba(2, 14, 21, 0.6) 45%,
		rgba(2, 14, 21, 0.6) 55%,
		rgba(2, 14, 21, 0.05) 100%
	);
`;

const Timer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 900;
	font-size: 56px;
`;

const Ruler = styled.div`
	width: 100%;
	background-color: #ffff52;
`;

const Est = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32px;
`;

interface Props {
	timerHeight: string;
	rulerHeight?: string;
	estHeight: string;
}

export class RtaijTimer extends React.Component<Props> {
	render() {
		return (
			<Container>
				<Timer style={{height: this.props.timerHeight}}>time</Timer>
				<Ruler style={{height: this.props.rulerHeight || '4px'}} />
				<Est style={{height: this.props.estHeight}}>
					予定タイム&nbsp;est
				</Est>
			</Container>
		);
	}
}
