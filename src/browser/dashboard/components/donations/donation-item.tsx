import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
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
