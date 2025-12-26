import headerMessage from "../../../images/header_message_main.svg";
import {LongText} from "../../lib/text";
import {MessageContent} from "..";
import {useLayoutEffect, useRef} from "react";
import {Linear, Power2, gsap} from "gsap";
import {text} from "../../../styles/colors";

export type OnCompleteHandler = () => void;

const TEXT_LINE_HEIGHT = 30;
const SECS_PER_LINE = 0.8;

export const InGameDonationMessage = ({
	message,
	rows,
	onComplete,
}: {
	message: MessageContent;
	rows: number;
	onComplete: OnCompleteHandler;
}) => {
	const textMaxHeight = rows * 30;

	const wrapperRef = useRef(null);
	const textRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!message.text) {
			return;
		}
		const wrapperElm = wrapperRef.current;
		const textElm = textRef.current;
		if (!wrapperElm || !textElm) {
			return;
		}

		const initialRows = Math.round(textElm.clientHeight / TEXT_LINE_HEIGHT);
		const initViewDuration = initialRows * SECS_PER_LINE;
		const scrollLength = textElm.scrollHeight - textElm.clientHeight;
		const scrollRows = Math.round(scrollLength / TEXT_LINE_HEIGHT);
		const scrollDuration = scrollRows * SECS_PER_LINE;

		console.log(
			`Init in ${initViewDuration} secs, Scroll with ${scrollDuration} secs`,
		);

		const tl = gsap.timeline();
		tl.call(() => {
			console.log("start scroll animation");
			textElm.scrollTop = 0;
		});
		tl.fromTo(
			wrapperElm,
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 0.6,
				ease: Power2.easeOut,
			},
			"+=0.6",
		);
		tl.to({}, {duration: initViewDuration});
		tl.to(textElm, {
			scrollTop: scrollLength,
			duration: scrollDuration,
			ease: Linear.easeNone,
		});
		tl.call(
			() => {
				onComplete();
			},
			[],
			"+=5",
		);
		tl.call(() => {
			console.log("finish scroll animation");
		});

		return () => {
			tl.kill();
		};
	}, [message.user, message.text]);

	return (
		<div
			ref={wrapperRef}
			style={{
				display: "grid",
				gridTemplateRows: "43px 1fr 30px",
				alignContent: "center",
				justifyContent: "stretch",
				color: text.donation,
			}}
		>
			<img
				style={{
					alignSelf: "start",
				}}
				src={headerMessage}
				height={43}
				width={220}
			></img>

			<div
				ref={textRef}
				style={{
					maxHeight: `${textMaxHeight}px`,
					width: "100%",
					whiteSpace: "normal",
					wordBreak: "break-all",
					overflowY: "hidden",
					overflowX: "auto",
				}}
			>
				<LongText
					style={{
						fontSize: "18px",
						lineHeight: "30px",
						whiteSpace: "normal",
						wordBreak: "break-all",
						minHeight: "60px",
						display: "flex",
						alignItems: "center",
					}}
				>
					{message.text}
				</LongText>
			</div>

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
