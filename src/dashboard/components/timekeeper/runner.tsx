// Packages
import React from 'react';
import styled, {css} from 'styled-components';

// MUI Core
import Button from '@material-ui/core/Button';

// MUI Icons
import Flag from '@material-ui/icons/Flag';
import Undo from '@material-ui/icons/Undo';
import Cancel from '@material-ui/icons/Cancel';
import Edit from '@material-ui/icons/Edit';

// Ours
import {TimeObject} from '../../../lib/time-object';

const Container = styled.div`
	padding: 0 16px;
	display: grid;
	align-items: center;
	${({theme}) =>
		theme.index % 2 === 0 &&
		css`
			background-color: #dedede;
		`};
`;

const RunnerContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-areas: 'runner button';
`;

const RunnerName = styled.div`
	font-size: 24px;
`;

const RunnerStatus = styled.div`
	font-size: 24px;
	color: #adadad;
	${({theme}) =>
		theme.finished &&
		css`
			color: #43ac6a;
		`};
`;

const ButtonContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8px;
	justify-items: stretch;
	align-items: center;
`;

const EmptySlot = styled.div`
	font-size: 24px;
	color: #adadad;
	text-align: center;
`;

export class Runner extends React.Component<{
	runner: string | null;
	checklistCompleted: boolean;
	timer: TimeObject;
	index: number;
}> {
	render() {
		return (
			<Container theme={{index: this.props.index}}>
				{this.renderContent()}
			</Container>
		);
	}

	private readonly result = () => this.props.timer.results[this.props.index];

	private readonly renderStatus = () => {
		const result = this.result();
		return result ? result.formatted : 'Running';
	};

	private readonly renderContent = () => {
		if (!this.props.runner) {
			return <EmptySlot>- EMPTY SLOT -</EmptySlot>;
		}
		return (
			<RunnerContainer>
				<div>
					<RunnerName>{this.props.runner}</RunnerName>
					<RunnerStatus>{this.renderStatus()}</RunnerStatus>
				</div>
				<ButtonContainer>
					{this.finished() || (
							<Button variant='raised'>
								<Flag />完走
							</Button>
					)}
					{this.noResult() || (
							<Button variant='raised'>
								<Undo />再開
							</Button>
					)}
					{this.forfeited() || (
							<Button variant='raised'>
								<Cancel />リタイア
							</Button>
					)}
						<Button disabled={this.noResult()} variant='raised'>
							<Edit />編集
						</Button>
				</ButtonContainer>
			</RunnerContainer>
		);
	};

	private readonly finished = () => {
		const result = this.result();
		return Boolean(result && !result.forfeit);
	};

	private readonly forfeited = () => {
		const result = this.result();
		return Boolean(result && result.forfeit);
	};

	private readonly noResult = () => this.result() === null;
}
