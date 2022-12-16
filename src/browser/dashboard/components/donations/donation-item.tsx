import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import {Donation} from "../../../../nodecg/replicants";

type Props = {
	donation: Donation;
	onActivate?: (donation: Donation) => void;
	onDeactivate?: (pk: number) => void;
};

export const DonationItem = ({donation, onActivate, onDeactivate}: Props) => {
	return (
		<ListItem>
			<ListItemText
				primary={donation.name || "(匿名)"}
				secondary={
					<Typography variant='body2'>
						{donation.comment} (&yen;{donation.amount.toLocaleString()})
					</Typography>
				}
				style={{
					overflowX: "hidden",
				}}
			/>
			{onActivate && (
				<ListItemSecondaryAction>
					<IconButton
						title='配信に表示'
						edge='end'
						onClick={() => onActivate(donation)}
					>
						<ArrowRightAltIcon />
					</IconButton>
				</ListItemSecondaryAction>
			)}
			{onDeactivate && (
				<ListItemSecondaryAction>
					<IconButton
						title='表示待ちから削除'
						edge='end'
						onClick={() => onDeactivate(donation.pk)}
					>
						<ClearIcon />
					</IconButton>
				</ListItemSecondaryAction>
			)}
		</ListItem>
	);
};
