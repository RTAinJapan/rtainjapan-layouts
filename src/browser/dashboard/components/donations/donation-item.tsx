import CheckIcon from "@material-ui/icons/Check";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import {Donation} from "../../../../nodecg/replicants";

type Props = {
	donation: Donation;
};

export const DonationItem = ({donation}: Props) => {
	return (
		<ListItem>
			<ListItemText
				primary={donation.name || "(匿名)"}
				secondary={
					<Typography variant='body2'>
						{donation.comment} (&yen;{donation.amount.toLocaleString()})
					</Typography>
				}
			/>
			<ListItemSecondaryAction>
				<IconButton title='配信に表示' edge='end'>
					<CheckIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};
