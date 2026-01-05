import "modern-normalize";

import {FC, useEffect, useRef, useState} from "react";
import {FitText} from "../components/lib/fit-text";
import {BoldText, CreditTitleText} from "../components/lib/text";
import gsap from "gsap";
import {chunk} from "../../../extension/lib/array";
import {useFitViewport} from "../components/lib/use-fit-viewport";
import {render} from "../../render.js";
import {background, border} from "../styles/colors";
import {EventLogo} from "../components/event-logo";
import {InGameDonationPopup} from "../components/donation-message/in-game-popup";

const NAME_SHOW_DURATION = 5;

const runnersRep = nodecg.Replicant("runners");

const App: FC = () => {
	const [title, setTitle] = useState<string>();
	const [names, setNames] = useState<string[]>([]);
	const [text, setText] = useState<string[]>([]);

	const titleRef = useRef<HTMLDivElement>(null);
	const namesRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const timeline = gsap.timeline();
		nodecg.listenFor("startEndCredit", () => {
			if (runnersRep.value && nodecg.bundleConfig.endCredit) {
				const runners = [...runnersRep.value].sort((a, b) =>
					a.localeCompare(b, "ja"),
				);
				const staff = [...nodecg.bundleConfig.endCredit.staff].sort((a, b) =>
					a.localeCompare(b, "ja"),
				);
				const partners = [...nodecg.bundleConfig.endCredit.partners].sort(
					(a, b) => a.localeCompare(b, "ja"),
				);
				const volunteers = [...nodecg.bundleConfig.endCredit.volunteers].sort(
					(a, b) => a.localeCompare(b, "ja"),
				);
				const specialThanks = [
					...(nodecg.bundleConfig.endCredit?.specialThanks ?? []),
				].sort((a, b) => a.localeCompare(b, "ja"));

				const $title = titleRef.current;
				const $names = namesRef.current;

				const namesPosition = `+=${NAME_SHOW_DURATION}`;

				const toggleTitle = (title?: string) => {
					if (title) {
						timeline.add(() => {
							setTitle(title);
						});
						timeline.to($title, {opacity: 1, duration: 0.7});
					} else {
						timeline.to($title, {opacity: 0, duration: 0.7});
					}
				};
				const showNames = (currentNames: string[]) => {
					timeline.add(() => {
						setNames(currentNames);
					});
					timeline.to($names, {opacity: 1, duration: 0.5});
					timeline.to($names, {opacity: 0, duration: 0.5}, namesPosition);
				};

				// Runners
				toggleTitle("Runners");
				for (const c of chunk(runners, 15)) {
					showNames(c);
				}
				toggleTitle();

				// Volunteers
				toggleTitle("Volunteer Staff");
				for (const c of chunk(volunteers, 15)) {
					showNames(c);
				}
				toggleTitle();

				// Staff
				toggleTitle("Staff");
				showNames(staff);
				toggleTitle();

				// Partners
				toggleTitle("Partners");
				showNames(partners);
				toggleTitle();

				// Special Thanks
				if (specialThanks.length > 0) {
					toggleTitle("Special Thanks");
					showNames(specialThanks);
					toggleTitle();
				}

				// Text
				if (nodecg.bundleConfig.endCredit.text) {
					setText(nodecg.bundleConfig.endCredit.text);
					timeline.to(textRef.current, {opacity: 1, duration: 2}, "+=3");
				}
			}
		});
	}, []);

	const ref = useRef<HTMLDivElement>(null);
	useFitViewport(ref);

	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				width: "1920px",
				height: "1030px",
				color: "white",
				top: 0,
				left: 0,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "115px",
					left: "180px",
					width: "1560px",
					height: "860px",
					borderRadius: "20px",
					borderColor: border.credit,
					backgroundColor: background.credit,
				}}
			>
				<CreditTitleText
					ref={titleRef}
					style={{
						position: "absolute",
						top: "80px",
						left: "80px",
						width: "1440px",
						height: "100px",
						fontSize: "70px",
						display: "grid",
						placeItems: "center",
						opacity: 0,
					}}
				>
					{title}
				</CreditTitleText>
				<div
					ref={namesRef}
					style={{
						position: "absolute",
						top: "260px",
						left: "80px",
						right: "80px",
						bottom: "90px",
						display: "grid",
						gridTemplateRows: "repeat(5, 70px)",
						gridTemplateColumns: "repeat(3, 440px)",
						gap: "40px",
						opacity: 0,
						placeItems: "stretch",
					}}
				>
					{names.map((name) => (
						<FitText key={name} defaultSize={40} credit>
							{name}
						</FitText>
					))}
				</div>
				<div
					ref={textRef}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						display: "grid",
						gridAutoFlow: "row",
						placeContent: "center",
						placeItems: "center",
						gap: "50px",
						opacity: 0,
					}}
				>
					{text.map((t) => (
						<BoldText
							style={{
								fontSize: "60px",
								lineHeight: "100px",
								whiteSpace: "normal",
								textAlign: "center",
							}}
						>
							{t}
						</BoldText>
					))}
				</div>
			</div>
			<EventLogo
				setup
				style={{
					position: "absolute",
					top: "15px",
					left: "15px",
				}}
			/>
			<InGameDonationPopup
				rows={6}
				style={{
					position: "absolute",
					top: "35px",
					left: "133px",
					width: "325px",
					maxHeight: "263px",
				}}
			/>
		</div>
	);
};

render(<App />);
