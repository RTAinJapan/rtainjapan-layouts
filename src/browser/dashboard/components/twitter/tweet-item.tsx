import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import Favorite from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import {useEffect, useState} from "react";
import {TweetsTemp} from "../../../../nodecg/generated";

type Tweet = TweetsTemp[number];

type Props = {
	tweet: Tweet;
	onSubmit: (tweet: Tweet, onSuccess: () => void) => void;
	onSubmitFanArt: (tweet: Tweet, onSuccess: () => void) => void;
	onDelete: (onSuccess: () => void) => void;
};

type ButtonProps = Pick<IconButtonProps, "onClick">;

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
const SubmitFanArtButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<Favorite />
		</IconButton>
	);
};

export const TweetItem = ({
	tweet: propTweet,
	onSubmit,
	onSubmitFanArt,
	onDelete,
}: Props) => {
	const [tweet, setTweet] = useState<Tweet>(propTweet);

	useEffect(() => {
		setTweet(propTweet);
	}, [propTweet]);

	return (
		<ListItem>
			<ListItemText
				primary={tweet.name}
				secondary={
					<>
						<Typography
							variant='body2'
							style={{
								maxWidth: "500px",
							}}
						>
							{tweet.text}
						</Typography>
						{tweet.image && (
							<a href={tweet.image} target='_blank'>
								<img
									src={tweet.image}
									style={{
										maxWidth: "300px",
										maxHeight: "100px",
									}}
								/>
							</a>
						)}
					</>
				}
			/>
			<ListItemSecondaryAction>
				(
				<>
					<SubmitButton
						onClick={() => {
							onSubmit(tweet, () => {});
						}}
					/>
					/
					{tweet.image && (
						<>
							<SubmitFanArtButton
								onClick={() => {
									onSubmitFanArt(tweet, () => {});
								}}
							/>
							/
						</>
					)}
					<DeleteButton
						onClick={() => {
							onDelete(() => {});
						}}
					/>
				</>
				)
			</ListItemSecondaryAction>
		</ListItem>
	);
};
