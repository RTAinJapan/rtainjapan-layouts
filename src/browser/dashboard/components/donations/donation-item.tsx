import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import {Donation} from "../../../../nodecg/replicants";
import {useState} from "react";
import {IconButton} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

type Props = {
	donation: Donation;
	onActivate?: (donation: Donation) => void;
};

export const DonationItem = ({donation, onActivate}: Props) => {
	const [activated, setActivated] = useState(false);

	return (
		<ListItem
			secondaryAction={
				onActivate && (
					<IconButton
						onClick={() => {
							setActivated(true);
							onActivate(donation);
						}}
						disabled={activated}
						aria-label='配信に表示'
					>
						<CheckIcon />
					</IconButton>
				)
			}
		>
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
		</ListItem>
	);
};
