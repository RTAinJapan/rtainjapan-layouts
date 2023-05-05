import "modern-normalize";
import styled from "styled-components";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import UndoIcon from "@mui/icons-material/Undo";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import {useEffect, useState} from "react";

import {useReplicant} from "../../use-replicant";

const Container = styled.div`
	padding: 8px;
`;

type ButtonProps = Pick<IconButtonProps, "onClick">;

const EditButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<EditIcon />
		</IconButton>
	);
};

const SubmitButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<CheckIcon />
		</IconButton>
	);
};

const UndoButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<UndoIcon />
		</IconButton>
	);
};

const App = () => {
	const cameraNameRep = nodecg.Replicant("camera-name");
	const cameraName = useReplicant("camera-name");
	const [edit, setEdit] = useState<boolean>(false);
	const [cameraNameForm, setCameraNameForm] = useState({
		title: "",
		name: "",
	});
	const cameraState = useReplicant("camera-state");
	useEffect(() => {
		setCameraNameForm({
			title: cameraName?.title ?? "",
			name: cameraName?.name ?? "",
		});
	}, [cameraName]);

	return (
		<Container>
			<List>
				<ListItem>
					<ListItemText
						primary={
							edit ? (
								<input
									value={cameraNameForm?.title}
									onChange={({currentTarget: {value}}) => {
										setCameraNameForm((cameraNameForm) => ({
											...cameraNameForm,
											title: value,
										}));
									}}
									placeholder='タイトル'
								/>
							) : (
								`タイトル : ${cameraNameForm.title}`
							)
						}
						secondary={
							edit ? (
								<input
									value={cameraNameForm?.name}
									onChange={({currentTarget: {value}}) => {
										setCameraNameForm((cameraNameForm) => ({
											...cameraNameForm,
											name: value,
										}));
									}}
									placeholder='名前'
								/>
							) : (
								<Typography variant='body2'>{`名前 : ${cameraNameForm.name}`}</Typography>
							)
						}
					/>
					<ListItemSecondaryAction>
						{edit ? (
							<>
								<SubmitButton
									onClick={() => {
										if (cameraNameRep.value) {
											cameraNameRep.value = {...cameraNameForm};
										}
										setEdit(false);
									}}
								/>
								/
								<UndoButton
									onClick={() => {
										setCameraNameForm({
											title: cameraName?.title ?? "",
											name: cameraName?.name ?? "",
										});
										setEdit(false);
									}}
								/>
							</>
						) : (
							<>
								<EditButton
									onClick={() => {
										setEdit(true);
									}}
								/>
							</>
						)}
					</ListItemSecondaryAction>
				</ListItem>
			</List>
			<Button
				onClick={() => {
					nodecg.sendMessage("toggleCameraName");
				}}
				disabled={cameraState === "big"}
				variant='outlined'
			>
				{cameraState === "hidden"
					? "表示する"
					: cameraState === "big"
					? "表示中(大)"
					: "隠す"}
			</Button>
		</Container>
	);
};

ReactDOM.render(<App></App>, document.getElementById("root"));
