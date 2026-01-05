import headerMessageSetup from "../../../images/header_message_setup.svg";
import {LongText} from "../../lib/text";
import {MessageContent} from "..";

export const SetupDonationMessage = ({message}: {message: MessageContent}) => {
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
			<LongText
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
				{message.text}
			</LongText>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					alignSelf: "center",
					justifySelf: "end",
					gap: "8px",
				}}
			>
				<LongText
					style={{
						fontSize: "18px",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
					}}
				>
					{message.user}
				</LongText>
				<LongText
					style={{
						fontSize: "18px",
					}}
				>
					{message.amount}
				</LongText>
			</div>
		</div>
	);
};
