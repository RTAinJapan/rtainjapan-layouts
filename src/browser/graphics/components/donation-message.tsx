import gsap from "gsap";
import headerMessageSetup from "../images/header_message_setup.svg";
import {useEffect, useMemo, useState} from "react";
import {ThinText} from "./lib/text";
import {useReplicant} from "../../use-replicant";

// TODO: ゲーム画面版の寄付メッセージ表示対応

export const DonationMessage = ({
	onShow,
}: {
	onShow?: () => gsap.core.Tween | gsap.core.Timeline;
}) => {
	const [user, setUser] = useState("");
	const [text, setText] = useState("");
	const [amount, setAmount] = useState("");
	const tl = useMemo(() => gsap.timeline(), []);

	const rawDonationQueue = useReplicant("donation-queue");
	useEffect(() => {
		if (rawDonationQueue && rawDonationQueue.length > 0) {
			setUser(rawDonationQueue[0]?.name ?? "");
			setText(rawDonationQueue[0]?.comment ?? "");
			setAmount(`（￥${rawDonationQueue[0]?.amount?.toLocaleString() ?? ""}）`);
			// donation.queueは配列として持てるがファンアートと同じような表示をするので1つ取得するたびにキューは空にする
			nodecg.sendMessage("donation:clear-queue");
			if (onShow) {
				tl.add(onShow(), "+=0.2");
			}
		}
	}, [rawDonationQueue, onShow, tl]);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: "55px 18px auto 56px",
				paddingBottom: "10px",
				alignContent: "center",
				justifyContent: "stretch",
			}}
		>
			<img src={headerMessageSetup} height={55} width={420}></img>
			<div></div>
			<ThinText
				style={{
					fontSize: "18px",
					lineHeight: "30px",
					whiteSpace: "normal",
					wordBreak: "break-all",
					display: "-webkit-box",
					WebkitBoxOrient: "vertical",
					WebkitLineClamp: 20,
					overflow: "hidden",
					textOverflow: "ellipsis",
				}}
			>
				{text}
			</ThinText>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					alignSelf: "center",
					justifySelf: "end",
					gap: "8px",
				}}
			>
				<ThinText
					style={{
						fontSize: "18px",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{user}
				</ThinText>
				<ThinText
					style={{
						fontSize: "18px",
					}}
				>
					{amount}
				</ThinText>
			</div>
		</div>
	);
};
