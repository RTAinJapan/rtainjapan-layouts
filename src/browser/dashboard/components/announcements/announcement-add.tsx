import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import AddIcon from '@material-ui/icons/Add'
import { useState } from 'react';
import { Announcements } from '../../../../nodecg/generated';

type Announcement = Announcements[number]

type Props = {
    onSubmit: (announcement: Announcement, onSuccess: () => void) => void;
};

type ButtonProps = Pick<IconButtonProps, 'onClick'>;

const AddButton = (props: ButtonProps) => {
    return (
        <IconButton {...props}>
            <AddIcon />
        </IconButton>
    )
}

export const AnnouncementAdd = ({ onSubmit }: Props) => {

    const [ announcement, setAnnouncement ] = useState<Announcement>({
        title: '',
        content: '',
    });

    const clearInputs = () => {
        setAnnouncement({
            title: '',
            content: '',
        })
    };

    return (
        <ListItem>
            <ListItemText
				primary={
                    <input
                        value={announcement.title}
                        onChange={(e) => {
                            setAnnouncement({
                                ... announcement,
                                title: e.currentTarget.value
                            })
                        }}
                        placeholder='タイトル'
                    />}
				secondary={
                    <input
                        value={announcement.content}
                        onChange={(e) => {
                            setAnnouncement({
                                ... announcement,
                                content: e.currentTarget.value,
                            })
                        }}
                        placeholder='内容'
                        size={50}
                    />}
            />
            <ListItemSecondaryAction>
                <AddButton onClick={() => { onSubmit(announcement, () => {clearInputs()}) }} />
            </ListItemSecondaryAction>
        </ListItem>
    )
}