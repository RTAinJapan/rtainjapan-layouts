import List from "@material-ui/core/List";
import styled from "styled-components";
import {useReplicant} from "../../../use-replicant";
import {DonationItem} from "./donation-item";

const Container = styled.div`
	height: 720px;
	overflow-y: scroll;
`;

export const Donations = () => {
	const donations = useReplicant("donations");

	return (
		<Container>
			<List>
				{donations &&
					donations.map((donation) => (
						<DonationItem key={donation.pk} donation={donation} />
					))}
			</List>
		</Container>
	);
};
