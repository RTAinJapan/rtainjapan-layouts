import "modern-normalize";

import gsap from "gsap";
import ReactDOM from "react-dom";
import {BoldText, ThinText, TimerText} from "../components/lib/text";
import arrowImage from "../images/footer_arrow.svg";
import lineImage from "../images/footer_line.svg";
import bidwar1 from "../images/footer_bid1.svg";
import bidwar2 from "../images/footer_bid2.svg";
import bidwar3 from "../images/footer_bid3.svg";
import bidwar4 from "../images/footer_bid4.svg";
import bidwarDots from "../images/footer_reader.svg";
import {useReplicant} from "../../use-replicant";
import {
	CSSProperties,
	forwardRef,
	Fragment,
	useEffect,
	useRef,
	useState,
} from "react";
import {text} from "../styles/colors";
import {BidWar} from "../../../nodecg/replicants";
import cloneDeep from "lodash-es/cloneDeep";

const bidTargetLabels = [bidwar1, bidwar2, bidwar3, bidwar4];

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
			tl.fromTo(totalRef, {y: 0}, {y: "150%", duration: 14 / 60});
			tl.fromTo(
				amountRef,
				{y: "-150%"},
				{y: 0, duration: 32 / 60, ease: bounceEase},
				"<",
			);
			tl.call(() => {
				setDonationTotal(total);
			});

			tl.fromTo(totalRef, {y: "150%"}, {y: 0, duration: 0.5}, ">+3");
			tl.fromTo(amountRef, {y: 0}, {y: "-150%", duration: 0.5}, "<");
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

const above = -50;
const below = 50;
const duration = 0.5;
const oshiraseHold = 30;
const bidwarHold = 10;
const MAX_BIDWAR_DISPLAY = 4;

const Row = forwardRef<HTMLDivElement, {header: string; children?: unknown}>(
	(props, ref) => {
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
	},
);

const BidwarTarget = ({
	target,
}: {
	target: BidWar[number]["targets"][number];
}) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "auto minmax(36px 1fr) auto",
				gridTemplateRows: "1fr auto 3.6px 4px 7px",
			}}
		>
			<ThinText
				style={{
					fontSize: "18px",
					gridRow: "2 / 3",
					gridColumn: "1 / 2",
					maxWidth: "100%",
					overflow: "hidden",
					textOverflow: "ellipsis",
					alignSelf: "center",
					justifySelf: "start",
				}}
			>
				{target.name}
			</ThinText>
			<ThinText
				style={{
					fontSize: "18px",
					gridRow: "2 / 3",
					gridColumn: "3 / 4",
					alignSelf: "center",
					justifySelf: "end",
				}}
			>
				￥{target.total.toLocaleString("en")}
			</ThinText>
			<div
				style={{
					backgroundColor: "rgb(170,152,157)",
					gridColumn: "1 / 4",
					gridRow: "4 / 5",
					placeSelf: "stretch",
				}}
			></div>
			<div
				style={{
					backgroundColor: "rgb(85,50,60)",
					gridColumn: "1 / 4",
					gridRow: "4 / 5",
					alignSelf: "stretch",
					justifySelf: "start",
					width: `${target.percent * 100}%`,
				}}
			></div>
		</div>
	);
};

const BidWarRow = forwardRef<HTMLDivElement, {bidwar?: BidWar[number]}>(
	({bidwar}, ref) => {
		const slicedTargets = bidwar?.targets.slice(0, 4);
		const showDots =
			bidwar && slicedTargets && bidwar.targets.length > slicedTargets.length;
		return (
			<div
				ref={ref}
				style={{
					gridColumn: "1 / 2",
					gridRow: "1 / 2",
					display: "grid",
					gridTemplateColumns: `auto repeat(${slicedTargets?.length}, auto 1fr) auto`,
					alignContent: "stretch",
					justifyContent: "start",
				}}
			>
				<div
					style={{
						display: "grid",
						gridAutoFlow: "row",
						alignContent: "center",
						justifyContent: "start",
						fontSize: "18px",
					}}
				>
					<BoldText
						style={{
							overflow: "hidden",
							whiteSpace: "nowrap",
							maxWidth: "300px",
							textOverflow: "ellipsis",
						}}
					>
						{bidwar?.game}
					</BoldText>
					<ThinText
						style={{
							overflow: "hidden",
							whiteSpace: "nowrap",
							maxWidth: "300px",
							textOverflow: "ellipsis",
						}}
					>
						{bidwar?.name}
					</ThinText>
				</div>
				{slicedTargets?.map((target, index) => (
					<Fragment key={target.pk}>
						<img src={bidTargetLabels[index]}></img>
						<BidwarTarget target={target}></BidwarTarget>
					</Fragment>
				))}
				{showDots && <img src={bidwarDots}></img>}
			</div>
		);
	},
);

const Omnibar = () => {
	const sponsorAssets = useReplicant("assets:charity-logo");

	const rawBidWar = useReplicant("bid-war");
	const bidwars = useRef<BidWar>([]);
	useEffect(() => {
		if (rawBidWar) {
			bidwars.current = rawBidWar;
		}
	}, [rawBidWar]);

	const oshiraseRef = useRef<HTMLDivElement>(null);
	const bidwarRef = useRef<HTMLDivElement>(null);
	// const donationCommentRef = useRef<HTMLDivElement>(null);

	const donateLink = useRef<HTMLDivElement>(null);
	const twitchIncome = useRef<HTMLDivElement>(null);

	const bidwarRowA = useRef<HTMLDivElement>(null);
	const bidwarRowB = useRef<HTMLDivElement>(null);
	const [bidwarA, setBidwarA] = useState<BidWar[number]>();
	const [bidwarB, setBidwarB] = useState<BidWar[number]>();

	useEffect(() => {
		let tl: gsap.core.Timeline;

		const initialize = (playOshiraseEnter: boolean) => {
			tl = gsap.timeline();

			if (playOshiraseEnter) {
				tl.set(oshiraseRef.current, {y: below});
				tl.set(donateLink.current, {y: 0});
				tl.set(twitchIncome.current, {y: below});
				tl.to(bidwarRef.current, {y: above});
				tl.to(oshiraseRef.current, {y: 0}, "<");
			} else {
				tl.set(twitchIncome.current, {y: 0});
				tl.set(donateLink.current, {y: below});
				tl.to(twitchIncome.current, {y: above, duration});
				tl.to(donateLink.current, {y: 0, duration}, "<");
			}

			tl.set(twitchIncome.current, {y: below});
			tl.to(donateLink.current, {y: above, duration}, `+=${oshiraseHold}`);
			tl.to(twitchIncome.current, {y: 0, duration}, "<");

			tl.to({}, {}, `+=${oshiraseHold}`);

			tl.call(() => {
				const currentBidwars = cloneDeep(bidwars.current).slice(
					0,
					MAX_BIDWAR_DISPLAY,
				);
				if (!currentBidwars || currentBidwars.length === 0) {
					initialize(false);
					return;
				}

				tl.call(() => {
					setBidwarA(currentBidwars[0]);
				});
				tl.set(bidwarRowA.current, {y: 0});
				tl.set(bidwarRowB.current, {y: below});
				tl.set(bidwarRef.current, {y: below});
				tl.to(oshiraseRef.current, {y: above, duration});
				tl.to(bidwarRef.current, {y: 0, duration}, "<");
				tl.to({}, {}, `+=${bidwarHold}`);
				for (let i = 1; i < currentBidwars.length; i++) {
					tl.call(() => {
						(i % 2 === 1 ? setBidwarB : setBidwarA)(currentBidwars[i]);
					});
					const showing = (i % 2 === 1 ? bidwarRowB : bidwarRowA).current;
					const hiding = (i % 2 === 1 ? bidwarRowA : bidwarRowB).current;
					tl.set(showing, {y: below});
					tl.to(hiding, {y: above, duration});
					tl.to(showing, {y: 0, duration}, "<");
					tl.to({}, {}, `+=${bidwarHold}`);
				}
				tl.call(() => {
					initialize(true);
				});
			});
		};

		gsap.set(bidwarRef.current, {y: below});
		initialize(false);

		return () => {
			tl.kill();
		};
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
						ref={donateLink}
					>
						国境なき医師団への寄付は donate.rtain.jp から
					</ThinText>
					<ThinText
						style={{fontSize: "24px", gridColumn: "1 / 2", gridRow: "1 / 2"}}
						ref={twitchIncome}
					>
						イベント中のTwitchの収益も国境なき医師団に寄付されます
					</ThinText>
				</div>
			</Row>
			<Row header='寄付額投票' ref={bidwarRef}>
				<div style={{display: "grid"}}>
					<BidWarRow ref={bidwarRowA} bidwar={bidwarA}></BidWarRow>
					<BidWarRow ref={bidwarRowB} bidwar={bidwarB}></BidWarRow>
				</div>
			</Row>
			{/* <Row header='寄付コメント' ref={donationCommentRef}></Row> */}

			<img
				src={lineImage}
				style={{gridColumn: "3 / 4", gridRow: "1 / 2"}}
			></img>

			<div style={{width: "15px"}}></div>

			{/* <DonationTotal></DonationTotal> */}

			{/* <img
				src={sponsorAssets?.[0]?.url}
				style={{gridColumn: "5 / 6", gridRow: "1 / 2"}}
			></img> */}
		</div>
	);
};

ReactDOM.render(<Omnibar />, document.getElementById("root"));
