import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import {useState} from "react";
import {TweetsTemp} from "../../../../nodecg/generated/tweets-temp";

type Tweet = TweetsTemp[number];

type Props = {
	onSubmit: (tweet: Tweet, onSuccess: () => void) => void;
};

type ButtonProps = Pick<IconButtonProps, "onClick">;

const AddButton = (props: ButtonProps) => {
	return (
		<IconButton {...props}>
			<AddIcon />
		</IconButton>
	);
};

export const TweetAdd = ({onSubmit}: Props) => {
	const [tweet, setTweet] = useState<Tweet>({
		text: "",
		name: "",
		userId: "",
		image: "",
		service: "X(twitter)",
	});

	const clearInputs = () => {
		setTweet({
			text: "",
			name: "",
			userId: "",
			image: "",
			service: "X(twitter)",
		});
	};

	return (
		<ListItem>
			<ListItemText
				primary={
					<>
						<input
							value={tweet.userId}
							onChange={({currentTarget: {value}}) => {
								setTweet((tweet) => ({
									...tweet,
									userId: value,
								}));
							}}
							placeholder='ユーザーID'
							style={{
								marginRight: "10px",
							}}
						/>
						<input
							value={tweet.name}
							onChange={({currentTarget: {value}}) => {
								setTweet((tweet) => ({
									...tweet,
									name: value,
								}));
							}}
							placeholder='ユーザー名'
							style={{
								marginRight: "10px",
							}}
						/>
						<select
							value={tweet.service}
							onChange={({currentTarget: {value}}) => {
								setTweet((tweet) => ({
									...tweet,
									service: value as Tweet["service"],
								}));
							}}
							style={{
								marginRight: "10px",
							}}
						>
							<option value='X(twitter)'>X(twitter)</option>
							<option value='Bluesky'>Bluesky</option>
						</select>
						<input
							value={tweet.image}
							onChange={({currentTarget: {value}}) => {
								setTweet((tweet) => ({
									...tweet,
									image: value,
								}));
							}}
							size={50}
							placeholder='画像URL(ファンアートを表示したい場合入力してください)'
						/>
					</>
				}
				secondary={
					<textarea
						value={tweet.text}
						onChange={({currentTarget: {value}}) => {
							setTweet((tweet) => ({
								...tweet,
								text: value,
							}));
						}}
						placeholder='本文'
						cols={100}
						rows={4}
					/>
				}
			/>
			<ListItemSecondaryAction>
				<AddButton
					onClick={() => {
						onSubmit(tweet, () => {
							clearInputs();
						});
					}}
				/>
			</ListItemSecondaryAction>
		</ListItem>
	);
};
