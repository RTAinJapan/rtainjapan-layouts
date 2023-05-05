import {FC, useState} from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import styled from "styled-components";

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

export const EditTimeModal: FC<Props> = ({open, defaultValue, onFinish}) => {
	const [value, setValue] = useState<string>(defaultValue);

	const isValid = timeFormat.test(value);

	const updateClicked = () => {
		onFinish(value);
	};

	const cancelClicked = () => {
		onFinish();
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.currentTarget.value);
	};

	return (
		<Modal
			aria-labelledby='simple-modal-title'
			aria-describedby='simple-modal-description'
			open={open}
		>
			<Container>
				<Typography variant='h1'>マスタータイマー更新</Typography>
				<Inputs>
					<TextField
						required
						value={value}
						margin='normal'
						error={!isValid}
						onChange={handleInput}
					/>
				</Inputs>
				<Buttons>
					<Button onClick={updateClicked}>更新</Button>
					<Button onClick={cancelClicked}>キャンセル</Button>
				</Buttons>
			</Container>
		</Modal>
	);
};
