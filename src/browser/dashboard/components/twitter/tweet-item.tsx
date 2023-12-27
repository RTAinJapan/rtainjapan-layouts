import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
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
		<Tooltip title='ツイートを削除'>
			<IconButton {...props}>
				<DeleteIcon />
			</IconButton>
		</Tooltip>
	);
};

const SubmitButton = (props: ButtonProps) => {
	return (
		<Tooltip title='ツイート表示/ファンアート表示を実行'>
			<IconButton {...props}>
				<CheckIcon />
			</IconButton>
		</Tooltip>
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
							tweet.image
								? onSubmitFanArt(tweet, () => {})
								: onSubmit(tweet, () => {});
						}}
					/>
					/
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
