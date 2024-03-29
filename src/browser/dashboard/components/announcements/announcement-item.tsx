import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import {useEffect, useState} from "react";
import {Announcements} from "../../../../nodecg/generated";

type Announcement = Announcements[number];

type Props = {
	announcement: Announcement;
	onSubmit: (announcement: Announcement, onSuccess: () => void) => void;
	onDelete: (onSuccess: () => void) => void;
};

type ButtonProps = Pick<IconButtonProps, "onClick">;

const EditButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<EditIcon />
		</IconButton>
	);
};

const DeleteButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<DeleteIcon />
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

export const AnnouncementItem = ({
	announcement: propAnnouncement,
	onSubmit,
	onDelete,
}: Props) => {
	const [edit, setEdit] = useState<boolean>(false);
	const [announcement, setAnnouncement] =
		useState<Announcement>(propAnnouncement);

	useEffect(() => {
		setAnnouncement(propAnnouncement);
	}, [propAnnouncement]);

	return (
		<ListItem>
			<ListItemText
				primary={
					edit ? (
						<input
							value={announcement.title}
							onChange={({currentTarget: {value}}) => {
								setAnnouncement((announcement) => ({
									...announcement,
									title: value,
								}));
							}}
						/>
					) : (
						announcement.title
					)
				}
				secondary={
					edit ? (
						<input
							value={announcement.content}
							onChange={({currentTarget: {value}}) => {
								setAnnouncement((announcement) => ({
									...announcement,
									content: value,
								}));
							}}
							size={50}
						/>
					) : (
						<Typography variant='body2'>{announcement.content}</Typography>
					)
				}
			/>
			<ListItemSecondaryAction>
				{edit ? (
					<>
						<SubmitButton
							onClick={() => {
								onSubmit(announcement, () => {
									setEdit(false);
								});
							}}
						/>
						/
						<UndoButton
							onClick={() => {
								setAnnouncement(propAnnouncement);
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
						/
						<DeleteButton
							onClick={() => {
								onDelete(() => setEdit(false));
							}}
						/>
					</>
				)}
			</ListItemSecondaryAction>
		</ListItem>
	);
};
