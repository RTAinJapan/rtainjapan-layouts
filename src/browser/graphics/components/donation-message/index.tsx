import gsap from "gsap";
import {useEffect, useMemo, useState} from "react";
import {SetupDonationMessage} from "./ui/setup";
import {InGameDonationMessage} from "./ui/in-game";

export type MessageContent = {
	user: string;
	text: string;
	amount: string;
};

type GenericProps = {
	onShow?: () => gsap.core.Tween | gsap.core.Timeline;
};

type Props = GenericProps &
	({setup: true} | {setup?: false; rows: number; onComplete: () => void});

export const DonationMessage = (props: Props) => {
	const [user, setUser] = useState("");
	const [text, setText] = useState("");
	const [amount, setAmount] = useState("");
	const tl = useMemo(() => gsap.timeline(), []);

	useEffect(() => {
		nodecg.listenFor("donation:push", (donation) => {
			if (!props.onShow) {
				return;
			}
			setUser(donation.name ?? "");
			setText(donation.comment);
			setAmount(`（￥${donation.amount.toLocaleString() ?? ""}）`);
			if (props.onShow) {
				tl.add(props.onShow(), "+=0.2");
			}
		});
	}, []);

	if (props.setup) {
		return <SetupDonationMessage message={{user, text, amount}} />;
	}

	return (
		<InGameDonationMessage
			message={{user, text, amount}}
			rows={props.rows}
			onComplete={props.onComplete}
		/>
	);
};
