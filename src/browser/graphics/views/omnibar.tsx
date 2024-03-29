import "modern-normalize";
import "../styles/adobe-fonts.js";

import gsap from "gsap";
import {BoldText, ThinText, TimerText} from "../components/lib/text";
import arrowImage from "../images/footer_arrow.svg";
import arrowImage1 from "../images/footer_arrow1.svg";
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
	PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from "react";
import {text, background, bidwar} from "../styles/colors";
import {
	Announcements,
	BidChallenge,
	BidWar,
	Donation,
	DonationQueue,
} from "../../../nodecg/replicants";
import {klona as clone} from "klona/json";
import {useFitViewport} from "../components/lib/use-fit-viewport";
import {render} from "../../render.js";

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
const donationHold = 20;
const MAX_BIDWAR_DISPLAY = 4;
const MAX_CHALLENGE_DISPLAY = 2;

const Row = forwardRef<HTMLDivElement, PropsWithChildren<{header: string}>>(
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
					backgroundColor: bidwar.progressFrame,
					gridColumn: "1 / 4",
					gridRow: "4 / 5",
					placeSelf: "stretch",
				}}
			></div>
			<div
				style={{
					backgroundColor: bidwar.progress,
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

const BidChallengeRow = forwardRef<
	HTMLDivElement,
	{challenge?: BidChallenge[number]}
>(({challenge}, ref) => {
	return (
		<div
			ref={ref}
			style={{
				gridColumn: "1 / 2",
				gridRow: "1 / 2",
				display: "grid",
				gridTemplateColumns: `auto auto auto`,
				alignContent: "stretch",
				justifyContent: "start",
			}}
		>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `auto auto`,
					alignContent: "center",
					alignItems: "center",
					justifyContent: "start",
					fontSize: "18px",
				}}
			>
				<BoldText>{challenge?.game}</BoldText>
				<ThinText>：{challenge?.name}</ThinText>
			</div>
			<img src={arrowImage1}></img>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "auto 9px auto 18px auto",
					gridTemplateRows: "1fr auto 3.6px 4px 7px",
					alignContent: "center",
					alignItems: "baseline",
					justifyContent: "start",
				}}
			>
				<ThinText
					style={{
						fontSize: "24px",
						gridRow: "2 / 3",
						gridColumn: "1 / 2",
					}}
				>
					￥{challenge?.total.toLocaleString("en")}
				</ThinText>
				<ThinText
					style={{
						fontSize: "18px",
						gridRow: "2 / 3",
						gridColumn: "3 / 4",
					}}
				>
					/ ￥{challenge?.goal.toLocaleString("en")}
				</ThinText>
				<div
					style={{
						gridRow: "2 / 3",
						gridColumn: "5 / 6",
						display: "grid",
						gridTemplateColumns: "auto auto auto",
						alignContent: "center",
						alignItems: "baseline",
						justifyContent: "start",
					}}
				>
					<ThinText
						style={{
							fontSize: "18px",
						}}
					>
						達成率
					</ThinText>
					<ThinText
						style={{
							fontSize: "24px",
						}}
					>
						{((challenge?.percent || 0) * 100).toFixed()}
					</ThinText>
					<ThinText
						style={{
							fontSize: "18px",
						}}
					>
						％
					</ThinText>
				</div>
				<div
					style={{
						backgroundColor: bidwar.progressFrame,
						gridColumn: "1 / 6",
						gridRow: "4 / 5",
						placeSelf: "stretch",
					}}
				></div>
				<div
					style={{
						backgroundColor: bidwar.progress,
						gridColumn: "1 / 6",
						gridRow: "4 / 5",
						alignSelf: "stretch",
						justifySelf: "start",
						width: `${(challenge?.percent || 0) * 100}%`,
					}}
				></div>
			</div>
		</div>
	);
});

const DonationRow = forwardRef<HTMLDivElement, {donation?: Donation}>(
	({donation}, ref) => {
		return (
			<div
				ref={ref}
				style={{
					gridColumn: "1 / 2",
					gridRow: "1 / 2",
					display: "grid",
					gridTemplateColumns: `auto auto`,
					alignContent: "stretch",
					justifyContent: "start",
					fontSize: "22px",
				}}
			>
				<ThinText
					style={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{donation?.name && `${donation?.name}：`}
					{donation?.comment}
				</ThinText>
				<ThinText>（￥{donation?.amount?.toLocaleString()}）</ThinText>
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

	const rawBidChallenge = useReplicant("bid-challenge");
	const bidChallenges = useRef<BidChallenge>([]);
	useEffect(() => {
		if (rawBidChallenge) {
			bidChallenges.current = rawBidChallenge;
		}
	}, [rawBidChallenge]);

	const rawDonationQueue = useReplicant("donation-queue");
	const donationQueue = useRef<DonationQueue>([]);
	useEffect(() => {
		if (rawDonationQueue) {
			donationQueue.current = rawDonationQueue;
		}
	}, [rawDonationQueue]);

	const rawAnnouncements = useReplicant("announcements");
	const announcements = useRef<Announcements>([]);
	useEffect(() => {
		if (rawAnnouncements) {
			announcements.current = rawAnnouncements;
		}
	}, [rawAnnouncements]);

	const bidwarRef = useRef<HTMLDivElement>(null);
	const bidChallengeRef = useRef<HTMLDivElement>(null);
	const donationCommentRef = useRef<HTMLDivElement>(null);

	const announceRowA = useRef<HTMLDivElement>(null);
	const announceRowB = useRef<HTMLDivElement>(null);
	const [announceA, setAnnounceA] = useState<Announcements[number]>();
	const [announceB, setAnnounceB] = useState<Announcements[number]>();

	const bidwarRowA = useRef<HTMLDivElement>(null);
	const bidwarRowB = useRef<HTMLDivElement>(null);
	const [bidwarA, setBidwarA] = useState<BidWar[number]>();
	const [bidwarB, setBidwarB] = useState<BidWar[number]>();

	const challengeRowA = useRef<HTMLDivElement>(null);
	const challengeRowB = useRef<HTMLDivElement>(null);
	const [challengeA, setChallengeA] = useState<BidChallenge[number]>();
	const [challengeB, setChallengeB] = useState<BidChallenge[number]>();

	const donationRowA = useRef<HTMLDivElement>(null);
	const donationRowB = useRef<HTMLDivElement>(null);
	const [donationA, setDonationA] = useState<Donation>();
	const [donationB, setDonationB] = useState<Donation>();

	useEffect(() => {
		let tl: gsap.core.Timeline;
		let lastAnnouncement: Announcements[number] | undefined;

		const initialize = (playOshiraseEnter: boolean) => {
			tl = gsap.timeline();

			const currentAnnouncements = announcements.current;
			if (currentAnnouncements.length > 0) {
				if (!lastAnnouncement) {
					// 初回のinitialize時
					tl.set(announceRowA.current, {y: below});
					tl.set(announceRowB.current, {y: above});
					tl.call(() => {
						setAnnounceA(currentAnnouncements[0]);
					});
					tl.to(announceRowA.current, {y: 0, duration}, "<");
				} else if (
					lastAnnouncement.title === currentAnnouncements[0]?.title &&
					lastAnnouncement.content === currentAnnouncements[0]?.content &&
					!playOshiraseEnter
				) {
					// 直前の announcement を出し続ける場合
					// announceRowB を出してる場合があるので announceRowA に入れ替える
					tl.call(() => {
						setAnnounceA(currentAnnouncements[0]);
					});
					tl.set(announceRowA.current, {y: 0});
					tl.set(announceRowB.current, {y: above});
				} else {
					tl.to(announceRowA.current, {y: above, duration});
					tl.to(announceRowB.current, {y: above, duration}, "<");
					tl.set(announceRowA.current, {y: below});
					tl.set(announceRowB.current, {y: above});
					tl.call(() => {
						setAnnounceA(currentAnnouncements[0]);
					});
					tl.to(announceRowA.current, {y: 0, duration}, "<");
				}
				tl.to({}, {}, `+=${oshiraseHold}`);
				for (let i = 1; i < currentAnnouncements.length; i++) {
					const nextAnnouncement = currentAnnouncements[i];
					tl.call(() => {
						(i % 2 === 1 ? setAnnounceB : setAnnounceA)(nextAnnouncement);
					});
					const showing = (i % 2 === 1 ? announceRowB : announceRowA).current;
					const hiding = (i % 2 === 1 ? announceRowA : announceRowB).current;
					tl.to(hiding, {y: above, duration});
					tl.set(showing, {y: below});
					tl.to(showing, {y: 0, duration}, "<");
					tl.to({}, {}, `+=${oshiraseHold}`);
				}

				[lastAnnouncement] = currentAnnouncements.slice(-1);
			} else if (lastAnnouncement) {
				tl.to(announceRowA.current, {y: above, duration});
				tl.to(announceRowB.current, {y: above, duration}, "<");
				lastAnnouncement = undefined;
			}

			tl.call(() => {
				const currentBidwars = clone(bidwars.current).slice(
					0,
					MAX_BIDWAR_DISPLAY,
				);
				const currentChallenges = clone(bidChallenges.current).slice(
					0,
					MAX_CHALLENGE_DISPLAY,
				);
				const currentDonations = clone(donationQueue.current);
				tl.call(() => {
					nodecg.sendMessage("donation:clear-queue");
				});
				if (
					(!currentBidwars || currentBidwars.length === 0) &&
					(!currentChallenges || currentChallenges.length === 0) &&
					(!currentDonations || currentDonations.length === 0)
				) {
					initialize(false);
					return;
				}

				tl.to(announceRowA.current, {y: above, duration});
				tl.to(announceRowB.current, {y: above, duration}, "<");

				if (currentBidwars && currentBidwars.length > 0) {
					tl.call(() => {
						setBidwarA(currentBidwars[0]);
					});
					tl.set(bidwarRowA.current, {y: 0});
					tl.set(bidwarRowB.current, {y: below});
					tl.set(bidwarRef.current, {y: below});
					tl.to(bidwarRef.current, {y: 0, duration}, "<");
					tl.to({}, {}, `+=${bidwarHold}`);
					tl.set(bidwarRowB.current, {y: above});
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
					tl.to(bidwarRef.current, {y: above});
				}
				if (currentChallenges && currentChallenges.length > 0) {
					tl.call(() => {
						setChallengeA(currentChallenges[0]);
					});
					tl.set(challengeRowA.current, {y: 0});
					tl.set(challengeRowB.current, {y: below});
					tl.set(bidChallengeRef.current, {y: below});
					tl.to(bidChallengeRef.current, {y: 0, duration}, "<");
					tl.to({}, {}, `+=${bidwarHold}`);
					tl.set(challengeRowB.current, {y: above});
					for (let i = 1; i < currentChallenges.length; i++) {
						tl.call(() => {
							(i % 2 === 1 ? setChallengeB : setChallengeA)(
								currentChallenges[i],
							);
						});
						const showing = (i % 2 === 1 ? challengeRowB : challengeRowA)
							.current;
						const hiding = (i % 2 === 1 ? challengeRowA : challengeRowB)
							.current;
						tl.set(showing, {y: below});
						tl.to(hiding, {y: above, duration});
						tl.to(showing, {y: 0, duration}, "<");
						tl.to({}, {}, `+=${bidwarHold}`);
					}
					tl.to(bidChallengeRef.current, {y: above});
				}
				if (currentDonations && currentDonations.length > 0) {
					tl.call(() => {
						setDonationA(currentDonations[0]);
					});
					tl.set(donationRowA.current, {y: 0});
					tl.set(donationRowB.current, {y: below});
					tl.set(donationCommentRef.current, {y: below});
					tl.to(donationCommentRef.current, {y: 0, duration}, "<");
					tl.to({}, {}, `+=${donationHold}`);
					tl.set(donationRowB.current, {y: above});
					for (let i = 1; i < currentDonations.length; i++) {
						tl.call(() => {
							(i % 2 === 1 ? setDonationB : setDonationA)(currentDonations[i]);
						});
						const showing = (i % 2 === 1 ? donationRowB : donationRowA).current;
						const hiding = (i % 2 === 1 ? donationRowA : donationRowB).current;
						tl.set(showing, {y: below});
						tl.to(hiding, {y: above, duration});
						tl.to(showing, {y: 0, duration}, "<");
						tl.to({}, {}, `+=${donationHold}`);
					}
					tl.to(donationCommentRef.current, {y: above});
				}
				tl.call(() => {
					initialize(true);
				});
			});
		};

		gsap.set(announceRowA.current, {y: below});
		gsap.set(announceRowB.current, {y: below});
		gsap.set(bidwarRef.current, {y: below});
		gsap.set(bidChallengeRef.current, {y: below});
		gsap.set(donationCommentRef.current, {y: below});
		initialize(false);

		return () => {
			tl.revert();
		};
	}, []);

	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);

	return (
		<div
			ref={ref}
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
				backgroundColor: background.omnibar,
			}}
		>
			<Row header={announceA?.title || ""} ref={announceRowA}>
				<div style={{display: "grid"}}>
					<ThinText
						style={{fontSize: "24px", gridColumn: "1 / 2", gridRow: "1 / 2"}}
					>
						{announceA?.content || ""}
					</ThinText>
				</div>
			</Row>
			<Row header={announceB?.title || ""} ref={announceRowB}>
				<div style={{display: "grid"}}>
					<ThinText
						style={{fontSize: "24px", gridColumn: "1 / 2", gridRow: "1 / 2"}}
					>
						{announceB?.content || ""}
					</ThinText>
				</div>
			</Row>
			<Row header='寄付額投票' ref={bidwarRef}>
				<div style={{display: "grid"}}>
					<BidWarRow ref={bidwarRowA} bidwar={bidwarA}></BidWarRow>
					<BidWarRow ref={bidwarRowB} bidwar={bidwarB}></BidWarRow>
				</div>
			</Row>
			<Row header='寄付額チャレンジ' ref={bidChallengeRef}>
				<div style={{display: "grid"}}>
					<BidChallengeRow ref={challengeRowA} challenge={challengeA} />
					<BidChallengeRow ref={challengeRowB} challenge={challengeB} />
				</div>
			</Row>
			<Row header='寄付コメント' ref={donationCommentRef}>
				<div style={{display: "grid"}}>
					<DonationRow ref={donationRowA} donation={donationA} />
					<DonationRow ref={donationRowB} donation={donationB} />
				</div>
			</Row>

			{nodecg.bundleConfig.donationEnabled && (
				<>
					<img
						src={lineImage}
						style={{gridColumn: "3 / 4", gridRow: "1 / 2"}}
					></img>

					<div style={{width: "15px"}}></div>

					<DonationTotal></DonationTotal>

					<img
						src={sponsorAssets?.[0]?.url}
						style={{
							gridColumn: "5 / 6",
							gridRow: "1 / 2",
							width: "100%",
							height: "100%",
						}}
					></img>
				</>
			)}
		</div>
	);
};

render(<Omnibar />);
