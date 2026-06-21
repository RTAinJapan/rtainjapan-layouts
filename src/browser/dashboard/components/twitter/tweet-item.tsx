import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import DeleteIcon from "@mui/icons-material/Delete";
import {useEffect, useState} from "react";
import {TweetsTemp} from "../../../../nodecg/generated/tweets-temp";

type Tweet = TweetsTemp[number];

type Props = {
	tweet: Tweet;
	onToggleQueue: () => void;
	onDelete: () => void;
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

const QueueButton = ({queued, ...props}: ButtonProps & {queued: boolean}) => {
	return (
		<Tooltip title={queued ? "キューから外す" : "キューに追加"}>
			<IconButton {...props} color={queued ? "primary" : "default"}>
				{queued ? <PlaylistAddCheckIcon /> : <PlaylistAddIcon />}
			</IconButton>
		</Tooltip>
	);
};

export const TweetItem = ({
	tweet: propTweet,
	onToggleQueue,
	onDelete,
}: Props) => {
	const [tweet, setTweet] = useState<Tweet>(propTweet);

	useEffect(() => {
		setTweet(propTweet);
	}, [propTweet]);

	return (
		<ListItem
			secondaryAction={
				<>
					<QueueButton
						queued={Boolean(tweet.queued)}
						onClick={() => {
							onToggleQueue();
						}}
					/>
					/
					<DeleteButton
						onClick={() => {
							onDelete();
						}}
					/>
				</>
			}
		>
			<ListItemText
				disableTypography
				primary={
					<Typography component='div' variant='body1'>
						{`${tweet.name} (@${tweet.userId}) - ${tweet.service}`}
					</Typography>
				}
				secondary={
					<div>
						<Typography
							component='span'
							variant='body2'
							style={{
								display: "block",
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
					</div>
				}
			/>
		</ListItem>
	);
};
