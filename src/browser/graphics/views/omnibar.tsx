import "modern-normalize";

import gsap from "gsap";
import ReactDOM from "react-dom";
import {BoldText, ThinText, TimerText} from "../components/lib/text";
import arrowImage from "../images/footer_arrow.svg";
import lineImage from "../images/footer_line.svg";
import {useReplicant} from "../../use-replicant";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {text} from "../styles/colors";

const donationTextContainerStyle: CSSProperties = {
	gridRow: "1 / 2",
	gridColumn: "1 / 2",
	display: "grid",
	gridAutoFlow: "column",
	alignItems: "baseline",
	willChange: "transform",
};

const bounceEase = (progress: number) => {
	// x is 0 to 32
	const x = progress * 32;
	if (x <= 20) {
		return (-1 / 160) * x ** 2 + (7 / 40) * x;
	}
	if (x <= 28) {
		return (-1 / 160) * x ** 2 + (3 / 10) * x - 5 / 2;
	}
	return (-1 / 160) * x ** 2 + (3 / 8) * x - 23 / 5;
};

const Omnibar = () => {
	const sponsorAssets = useReplicant("assets:charity-logo");
	const textRef = useRef<HTMLDivElement>(null);
	const [mainText, setMainText] = useState("");

	useEffect(() => {
		const textLoop = [
			"国境なき医師団への寄付は donate.rtain.jp から",
			"イベント中のTwitchの収益も国境なき医師団に寄付されます",
		];
		const tl = gsap.timeline({repeat: -1});
		for (const text of textLoop) {
			tl.call(() => {
				setMainText(text);
			});
			tl.fromTo(textRef.current, {opacity: 0}, {opacity: 1, duration: 0.5});
			tl.fromTo(
				textRef.current,
				{opacity: 1},
				{opacity: 0, duration: 0.5},
				"+=60",
			);
		}
		return () => {
			tl.kill();
		};
	}, []);

	const [donationTotal, setDonationTotal] = useState(0);
	const [donationAmount, setDonationAmount] = useState(0);
	const amountTextRef = useRef<HTMLDivElement>(null);
	const donationTotalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const tl = gsap.timeline();
		nodecg.readReplicant("donation-total", (total) => {
			if (total) {
				setDonationTotal(total);
			}
		});
		nodecg.listenFor("donation", ({amount, total}) => {
			const totalRef = donationTotalRef.current;
			const amountRef = amountTextRef.current;
			if (!totalRef || !amountRef) {
				return;
			}

			tl.call(() => {
				setDonationAmount(amount);
			});
			tl.to(totalRef, {transform: "translateY(-150%)", duration: 14 / 60});
			tl.to(
				amountRef,
				{
					transform: "translateY(0%)",
					duration: 32 / 60,
					ease: bounceEase,
				},
				"<",
			);
			tl.set(totalRef, {transform: "translateY(150%)"});
			tl.call(() => {
				setDonationTotal(total);
			});

			tl.to(totalRef, {transform: "translateY(0%)", duration: 0.5}, ">+3");
			tl.to(amountRef, {transform: "translateY(-150%)", duration: 0.5}, "<");
			tl.set(amountRef, {transform: "translateY(150%)"});
		});
	}, []);

	return (
		<div
			style={{
				position: "absolute",
				overflow: "hidden",
				width: "1920px",
				height: "50px",
				top: 0,
				left: 0,
				display: "grid",
				gridTemplateColumns: "15px auto auto 1fr auto auto auto",
				placeContent: "stretch",
				alignItems: "center",
				color: text.omnibar,
				backgroundColor: "rgba(255,255,255,0.8)",
			}}
		>
			<div>{/* empty */}</div>
			<ThinText style={{fontSize: "24px"}}>RTA in Japanからのお知らせ</ThinText>
			<img src={arrowImage}></img>
			<ThinText ref={textRef} style={{fontSize: "24px"}}>
				{mainText}
			</ThinText>
			<img src={lineImage}></img>
			<div
				style={{
					display: "grid",
					gridAutoFlow: "column",
					placeContent: "center",
					alignItems: "center",
					justifyItems: "end",
				}}
			>
				<div ref={donationTotalRef} style={{...donationTextContainerStyle}}>
					<BoldText style={{fontSize: "28px"}}>¥</BoldText>
					<TimerText style={{fontSize: "36px"}}>
						{donationTotal?.toLocaleString()}
					</TimerText>
				</div>
				<div
					ref={amountTextRef}
					style={{
						...donationTextContainerStyle,
						transform: "translateY(150%)",
					}}
				>
					<BoldText style={{fontSize: "34px"}}>+</BoldText>
					<TimerText style={{fontSize: "36px"}}>
						{donationAmount.toLocaleString()}
					</TimerText>
				</div>
			</div>
			<img src={sponsorAssets?.[0]?.url}></img>
		</div>
	);
};

ReactDOM.render(<Omnibar />, document.getElementById("root"));
