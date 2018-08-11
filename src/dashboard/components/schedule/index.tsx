// Packages
import React from 'react';
import styled from 'styled-components';

// MUI Core
import Button from '@material-ui/core/Button';

// MUI Icons
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';

// Ours
import {scheduleRep, currentRunRep, nextRunRep} from '../../../lib/replicants';
import {Schedule as ScheduleSchema} from '../../../../types/schemas/schedule';
import {CurrentRun} from '../../../../types/schemas/currentRun';
import {NextRun} from '../../../../types/schemas/nextRun';
import {RunInfo} from './run-info';
import {BorderedBox} from '../lib/bordered-box';
import {NoWrapButton} from '../lib/no-wrap-button';
import {Typeahead} from './typeahead';
import nodecg from '../../../lib/nodecg';
import {EditRun} from './edit';

const Container = BorderedBox.extend`
	height: calc(100vh - 32px);
	padding: 16px;
	display: grid;
	grid-template-rows: auto 1fr;
	grid-gap: 12px;
`;

const SelectionContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 50% 1fr;
	grid-gap: 8px;
`;

const RunInfoContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 0px 1fr;
	grid-gap: 16px;
`;

const Divider = styled.div`
	border-left: 1px dashed black;
`;

const EditControls = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;
`;

const moveNextRun = () => {
	nodecg.sendMessage('nextRun');
};

const movePreviousRun = () => {
	nodecg.sendMessage('previousRun');
};

interface State {
	titles: Array<string | undefined>;
	currentRun: CurrentRun;
	nextRun: NextRun;
	edit?: 'current' | 'next';
}

export class Schedule extends React.Component<{}, State> {
	public state: State = {
		titles: [],
		currentRun: {},
		nextRun: {},
	};

	public componentDidMount() {
		scheduleRep.on('change', this.scheduleChangeHandler);
		currentRunRep.on('change', this.currentRunChangeHandler);
		nextRunRep.on('change', this.nextRunChangeHandler);
	}

	public componentWillUnmount() {
		scheduleRep.removeListener('change', this.scheduleChangeHandler);
		currentRunRep.removeListener('change', this.currentRunChangeHandler);
		nextRunRep.removeListener('change', this.nextRunChangeHandler);
	}

	public render() {
		return (
			<Container>
				<SelectionContainer>
					<Button onClick={movePreviousRun}>
						<ArrowBack />前
					</Button>
					<Typeahead titles={this.state.titles} />
					<Button onClick={moveNextRun}>
						次<ArrowForward />
					</Button>
				</SelectionContainer>
				<RunInfoContainer>
					<RunInfo run={this.state.currentRun} label="現在のゲーム" />
					<Divider />
					<RunInfo run={this.state.nextRun} label="次のゲーム" />
				</RunInfoContainer>
				<EditControls>
					<NoWrapButton onClick={this.editCurrentRun}>
						編集：現在のゲーム
					</NoWrapButton>
					<NoWrapButton onClick={this.updateClicked}>
						手動更新
					</NoWrapButton>
					<NoWrapButton onClick={this.editNextRun}>
						編集：次のゲーム
					</NoWrapButton>
				</EditControls>
				<EditRun
					edit={this.state.edit}
					defaultValue={
						this.state.edit === 'current'
							? this.state.currentRun
							: this.state.nextRun
					}
					onFinish={this.onEditFinish}
				/>
			</Container>
		);
	}

	private readonly editCurrentRun = () => {
		this.setState({edit: 'current'});
	};

	private readonly editNextRun = () => {
		this.setState({edit: 'next'});
	};

	private readonly onEditFinish = () => {
		this.setState({edit: undefined});
	};

	private readonly updateClicked = () => {
		nodecg.sendMessage('manualUpdate');
	};

	private readonly scheduleChangeHandler = (newVal: ScheduleSchema) => {
		if (!newVal) {
			return;
		}
		const titles = newVal.map(run => run.title);
		this.setState({titles});
	};

	private readonly currentRunChangeHandler = (newVal: CurrentRun) => {
		if (!newVal) {
			return;
		}
		this.setState({currentRun: newVal});
	};

	private readonly nextRunChangeHandler = (newVal: NextRun) => {
		this.setState({nextRun: newVal || {}});
	};
}
