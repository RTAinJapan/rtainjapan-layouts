import blueGrey from '@material-ui/core/colors/blueGrey';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import Cancel from '@material-ui/icons/Cancel';
import Edit from '@material-ui/icons/Edit';
import Flag from '@material-ui/icons/Flag';
import Undo from '@material-ui/icons/Undo';
import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import {Timer} from '../../../../nodecg/replicants';
import {ColoredButton} from '../lib/colored-button';
import {EditTimeModal} from './edit';

const Container = styled.div`
	padding: 0 16px;
	display: grid;
	align-items: center;
	${(props: {index: number}) =>
		props.index % 2 === 0 &&
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
	${(props: {finished: boolean}) =>
		props.finished &&
		css`
			color: #43ac6a;
		`};
`;

const ButtonContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 80px);
	grid-gap: 8px;
	justify-items: stretch;
	align-items: center;
`;

const EmptySlot = styled.div`
	font-size: 24px;
	color: #adadad;
	text-align: center;
`;

interface Props {
	runner: string | undefined;
	checklistCompleted: boolean;
	timer: Timer;
	index: number;
}

export const Runner: React.FunctionComponent<Props> = (props) => {
	const [isModalOpened, setIsModalOpened] = useState(false);

	if (!props.runner) {
		return (
			<Container index={props.index}>
				<EmptySlot>― EMPTY SLOT ―</EmptySlot>
			</Container>
		);
	}

	const result = props.timer.results[props.index];
	const shouldShowResume = Boolean(result);
	const shouldDisableEdit = !shouldShowResume;
	const shouldShowFinish = Boolean(!result || result.forfeit);
	const shouldShowForfeit = Boolean(!result || !result.forfeit);
	const status = result ? result.formatted : 'Running';
	const defaultEditValue = result ? result.formatted : '00:00';

	return (
		<Container index={props.index}>
			<RunnerContainer>
				<div>
					<RunnerName>{props.runner}</RunnerName>
					<RunnerStatus finished={!shouldShowFinish}>{status}</RunnerStatus>
				</div>
				<ButtonContainer>
					{shouldShowFinish && (
						<ColoredButton
							color={green}
							ButtonProps={{
								fullWidth: true,
								onClick: () => {
									nodecg.sendMessage('completeRunner', {
										index: props.index,
										forfeit: false,
									});
								},
							}}
						>
							<Flag />
							完走
						</ColoredButton>
					)}
					{shouldShowResume && (
						<ColoredButton
							color={green}
							ButtonProps={{
								fullWidth: true,
								onClick: () => {
									nodecg.sendMessage('resumeRunner', props.index);
								},
							}}
						>
							<Undo />
							再開
						</ColoredButton>
					)}
					{shouldShowForfeit && (
						<ColoredButton
							color={blueGrey}
							ButtonProps={{
								fullWidth: true,
								onClick: () => {
									nodecg.sendMessage('completeRunner', {
										index: props.index,
										forfeit: true,
									});
								},
							}}
						>
							<Cancel />
							リタイア
						</ColoredButton>
					)}
					<ColoredButton
						color={grey}
						ButtonProps={{
							fullWidth: true,
							onClick: () => {
								setIsModalOpened(true);
							},
							disabled: shouldDisableEdit,
						}}
					>
						<Edit />
						編集
					</ColoredButton>
				</ButtonContainer>
				<EditTimeModal
					defaultValue={defaultEditValue}
					open={isModalOpened}
					onFinish={(value?: string) => {
						if (value) {
							nodecg.sendMessage('editTime', {
								index: props.index,
								newTime: value,
							});
						}
						setIsModalOpened(false);
					}}
				/>
			</RunnerContainer>
		</Container>
	);
};
