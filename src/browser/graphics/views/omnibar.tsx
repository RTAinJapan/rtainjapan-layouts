import "modern-normalize";

import gsap from "gsap";
import ReactDOM from "react-dom";
import {BoldText, ThinText, TimerText} from "../components/lib/text";
import arrowImage from "../images/footer_arrow.svg";
import lineImage from "../images/footer_line.svg";
import {useReplicant} from "../../use-replicant";
import {
	CSSProperties,
	forwardRef,
	ReactElement,
	RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
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

const DonationTotal = () => {
	const [donationTotal, setDonationTotal] = useState(0);
	const [donationAmount, setDonationAmount] = useState(0);
	const amountTextRef = useRef<HTMLDivElement>(null);
	const donationTotalRef = useRef<HTMLDivElement>(null);

	// donation total animation
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
			tl.to(totalRef, {yPercent: -150, duration: 14 / 60});
			tl.to(amountRef, {yPercent: 0, duration: 32 / 60, ease: bounceEase}, "<");
			tl.set(totalRef, {yPercent: 150});
			tl.call(() => {
				setDonationTotal(total);
			});

			tl.to(totalRef, {yPercent: 0, duration: 0.5}, ">+3");
			tl.to(amountRef, {yPercent: -150, duration: 0.5}, "<");
			tl.set(amountRef, {yPercent: 150});
		});
	}, []);

	return (
		<div
			style={{
				gridColumn: "4 / 5",
				gridRow: "1 / 2",
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
	);
};

const move = 50;
const duration = 0.5;
const hold = 60;

const Row = forwardRef<
	HTMLDivElement,
	{header: string; children?: ReactElement}
>((props, ref) => {
	return (
		<div
			ref={ref}
			style={{
				gridColumn: "2 / 3",
				gridRow: "1 / 2",
				alignItems: "center",
				display: "grid",
				gridTemplateColumns: "auto auto 1fr",
			}}
		>
			<ThinText style={{fontSize: "24px"}}>{props.header}</ThinText>
			<img src={arrowImage}></img>
			{props.children}
		</div>
	);
});

const Omnibar = () => {
	const sponsorAssets = useReplicant("assets:charity-logo");

	const [tl, setTl] = useState<gsap.core.Timeline>();
	useEffect(() => {
		const tl = gsap.timeline({repeat: -1});
		setTl(tl);
		return () => {
			tl.kill();
		};
	}, []);

	const oshiraseRef = useRef<HTMLDivElement>(null);
	const bidwarRef = useRef<HTMLDivElement>(null);
	const donationCommentRef = useRef<HTMLDivElement>(null);

	const donateLinkTextRef = useRef<HTMLDivElement>(null);
	const twitchRevenueTextRef = useRef<HTMLDivElement>(null);

	const swapContent = useCallback(
		(
			previous: RefObject<HTMLElement> | undefined,
			next: RefObject<HTMLElement>,
		) => {
			const tl = gsap.timeline();
			tl.fromTo(next.current, {y: move}, {y: 0, duration});
			if (previous) {
				tl.fromTo(previous.current, {y: 0}, {y: -move, duration}, "<");
			}
			return tl;
		},
		[],
	);

	useEffect(() => {
		gsap.set([bidwarRef.current, donationCommentRef.current], {y: move});
	}, []);

	useEffect(() => {
		if (!tl) {
			return;
		}
		tl.add(swapContent(donateLinkTextRef, twitchRevenueTextRef), `+=${hold}`);
		tl.add(swapContent(twitchRevenueTextRef, donateLinkTextRef), `+=${hold}`);
	}, [tl, swapContent]);

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
				gridTemplateColumns: "15px 1fr auto auto auto",
				gridTemplateRows: "50px",
				placeContent: "stretch",
				alignItems: "center",
				color: text.omnibar,
				backgroundColor: "rgba(255,255,255,0.8)",
			}}
		>
			<Row header='RTA in Japanからのお知らせ' ref={oshiraseRef}>
				<div style={{display: "grid"}}>
					<ThinText
						style={{fontSize: "24px", gridColumn: "1 / 2", gridRow: "1 / 2"}}
						ref={donateLinkTextRef}
					>
						国境なき医師団への寄付は donate.rtain.jp から
					</ThinText>
					<ThinText
						style={{fontSize: "24px", gridColumn: "1 / 2", gridRow: "1 / 2"}}
						ref={twitchRevenueTextRef}
					>
						イベント中のTwitchの収益も国境なき医師団に寄付されます
					</ThinText>
				</div>
			</Row>
			<Row header='寄付額投票' ref={bidwarRef}></Row>
			<Row header='寄付コメント' ref={donationCommentRef}></Row>

			<img
				src={lineImage}
				style={{gridColumn: "3 / 4", gridRow: "1 / 2"}}
			></img>

			<DonationTotal></DonationTotal>

			<img
				src={sponsorAssets?.[0]?.url}
				style={{gridColumn: "5 / 6", gridRow: "1 / 2"}}
			></img>
		</div>
	);
};

ReactDOM.render(<Omnibar />, document.getElementById("root"));
