import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import {useState} from "react";
import {Announcements} from "../../../../nodecg/generated/announcements";

type Announcement = Announcements[number];

type Props = {
	onSubmit: (announcement: Announcement, onSuccess: () => void) => void;
};

type ButtonProps = Pick<IconButtonProps, "onClick">;

const AddButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<AddIcon />
		</IconButton>
	);
};

export const AnnouncementAdd = ({onSubmit}: Props) => {
	const [announcement, setAnnouncement] = useState<Announcement>({
		title: "",
		content: "",
	});

	const clearInputs = () => {
		setAnnouncement({
			title: "",
			content: "",
		});
	};

	return (
		<ListItem>
			<ListItemText
				primary={
					<input
						value={announcement.title}
						onChange={({currentTarget: {value}}) => {
							setAnnouncement((announcement) => ({
								...announcement,
								title: value,
							}));
						}}
						placeholder='タイトル'
					/>
				}
				secondary={
					<input
						value={announcement.content}
						onChange={({currentTarget: {value}}) => {
							setAnnouncement((announcement) => ({
								...announcement,
								content: value,
							}));
						}}
						placeholder='内容'
						size={50}
					/>
				}
			/>
			<ListItemSecondaryAction>
				<AddButton
					onClick={() => {
						onSubmit(announcement, () => {
							clearInputs();
						});
					}}
				/>
			</ListItemSecondaryAction>
		</ListItem>
	);
};
