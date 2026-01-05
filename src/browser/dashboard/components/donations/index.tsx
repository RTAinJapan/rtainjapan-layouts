import {ListItemText, Typography} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {styled} from "@mui/material/styles";
import {Donation} from "../../../../nodecg/replicants";
import {useReplicant} from "../../../use-replicant";
import {DonationItem} from "./donation-item";

const Container = styled("div")({
	display: "grid",
	height: "720px",
	overflowY: "scroll",
});

export const Donations = () => {
	const donations = useReplicant("donations");

	const pushDonation = (donation: Donation) => {
		nodecg.sendMessage("donation:push", donation);
	};

	return (
		<Container>
			<div>
				<List>
					<ListItem dense>
						<ListItemText>
							<Typography
								variant='body1'
								style={{
									textAlign: "center",
								}}
							>
								承認済みコメント
							</Typography>
						</ListItemText>
					</ListItem>
					{donations &&
						donations
							.filter((donation) => !donation.featured)
							.map((donation) => (
								<DonationItem
									key={donation.pk}
									donation={donation}
									onActivate={pushDonation}
								/>
							))}
				</List>
			</div>
		</Container>
	);
};
