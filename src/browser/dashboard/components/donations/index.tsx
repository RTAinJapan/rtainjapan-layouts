import {ListItemText, Typography} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {uniqBy} from "lodash";
import styled from "styled-components";
import {Donation} from "../../../../nodecg/replicants";
import {useReplicant} from "../../../use-replicant";
import {DonationItem} from "./donation-item";

const Container = styled.div`
	display: grid;
	grid-template-columns: calc(50% - 0.5px) 1px calc(50% - 0.5px);
	height: 720px;
	overflow-y: scroll;
`;

const Border = styled.div`
	background-color: #7a7a7a;
`;

const donationQueueRep = nodecg.Replicant("donation-queue");

export const Donations = () => {
	const donations = useReplicant("donations");
	const donationQueue = useReplicant("donation-queue");

	const pushDonationToQueue = (donation: Donation) => {
		if (!donationQueue) {
			return;
		}
		donationQueueRep.value = uniqBy(
			[...donationQueue, donation],
			(donation) => donation.pk,
		);
	};

	const removeDonationFromQueue = (pk: number) => {
		if (!donationQueue) {
			return;
		}
		donationQueueRep.value = [...donationQueue].filter(
			(donation) => donation.pk !== pk,
		);
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
						donations.map((donation) => (
							<DonationItem
								key={donation.pk}
								donation={donation}
								onActivate={pushDonationToQueue}
							/>
						))}
				</List>
			</div>
			<Border />
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
								配信表示待ち
							</Typography>
						</ListItemText>
					</ListItem>
					{donationQueue &&
						donationQueue.map((donation) => (
							<DonationItem
								key={donation.pk}
								donation={donation}
								onDeactivate={removeDonationFromQueue}
							/>
						))}
				</List>
			</div>
		</Container>
	);
};
