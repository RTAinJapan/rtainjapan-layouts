import List from "@mui/material/List";
import styled from "styled-components";
import {useReplicant} from "../../../use-replicant";
import {AnnouncementAdd} from "./announcement-add";
import {AnnouncementItem} from "./announcement-item";

const Container = styled.div``;

const announcementsRep = nodecg.Replicant("announcements");

export const Announcements = () => {
	const announcements = useReplicant("announcements");

	return (
		<Container>
			<List>
				{announcements?.map((announcement, index) => (
					<AnnouncementItem
						key={index}
						announcement={announcement}
						onSubmit={(announcement, onSuccess) => {
							if (announcementsRep.value) {
								announcementsRep.value[index] = {...announcement};
								onSuccess();
							}
						}}
						onDelete={(onSuccess) => {
							if (announcementsRep.value) {
								announcementsRep.value = [
									...announcements.slice(0, index),
									...announcements.slice(index + 1),
								];
								onSuccess();
							}
						}}
					/>
				))}
				<AnnouncementAdd
					onSubmit={(announcement, onSuccess) => {
						if (
							announcementsRep.value &&
							announcement.title &&
							announcement.content
						) {
							announcementsRep.value.push(announcement);
							onSuccess();
						}
					}}
				/>
			</List>
		</Container>
	);
};
