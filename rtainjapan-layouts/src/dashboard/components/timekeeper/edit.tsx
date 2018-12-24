import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import TypoGraphy from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	position: absolute;

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	background-color: white;
	box-sizing: border-box;
	padding: 16px;

	display: flex;
	flex-flow: column nowrap;
`;

const Inputs = styled.div`
	align-self: center;
`;

const Buttons = styled.div`
	align-self: flex-end;
`;

const timeFormat = /^(\d+:)?[0-5]?\d:[0-5]?\d$/;

interface Props {
	open: boolean;
	defaultValue: string;
	onFinish(value?: string): void;
}

interface State {
	value: string;
}

export class EditTimeModal extends React.Component<Props, State> {
	public state: State = {value: this.props.defaultValue};

	public render() {
		const isValid = timeFormat.test(this.state.value);
		return (
			<Modal
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
				open={this.props.open}
			>
				<Container>
					<TypoGraphy variant='headline'>
						マスタータイマー更新
					</TypoGraphy>
					<Inputs>
						<TextField
							required
							value={this.state.value}
							margin='normal'
							error={!isValid}
							onChange={this.handleInput}
						/>
					</Inputs>
					<Buttons>
						<Button onClick={this.updateClicked}>更新</Button>
						<Button onClick={this.cancelClicked}>キャンセル</Button>
					</Buttons>
				</Container>
			</Modal>
		);
	}

	private readonly updateClicked = () => {
		this.props.onFinish(this.state.value);
	};

	private readonly cancelClicked = () => {
		this.props.onFinish();
	};

	private readonly handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			value: e.currentTarget.value,
		});
	};
}
