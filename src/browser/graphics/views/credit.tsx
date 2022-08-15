import {FC, useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {FitText} from "../components/lib/fit-text";
import {BoldText, ThinText} from "../components/lib/text";
import topLogo from "../images/header_rij.svg";
import gsap from "gsap";
import chunk from "lodash-es/chunk";

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

				const $title = titleRef.current;
				const $names = namesRef.current;

				const namesPosition = `+=${NAME_SHOW_DURATION}`;

				const toggleTitle = (title?: string) => {
					if (title) {
						timeline.add(() => {
							setTitle(title);
						});
						timeline.to($title, {opacity: 1, dutation: 0.7});
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

				// Text
				if (nodecg.bundleConfig.endCredit.text) {
					setText(nodecg.bundleConfig.endCredit.text);
					timeline.to(textRef.current, {opacity: 1, duration: 2}, "+=3");
				}
			}
		});
	}, []);

	return (
		<div
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
					top: "80px",
					left: "160px",
					width: "1600px",
					height: "870px",
					borderRadius: "7px",
					border: "2px solid white",
					backgroundColor: "rgba(37, 48, 58, 0.6)",
				}}
			>
				<ThinText
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
				</ThinText>
				<div
					ref={namesRef}
					style={{
						position: "absolute",
						top: "260px",
						left: "80px",
						right: "80px",
						bottom: "60px",
						display: "grid",
						gridTemplateRows: "repeat(5, 1fr)",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "30px",
						opacity: 0,
					}}
				>
					{names.map((name) => (
						<FitText defaultSize={40} thin>
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
			<img
				src={topLogo}
				style={{position: "absolute", top: "20px", left: "30px"}}
			></img>
		</div>
	);
};

ReactDOM.render(<App></App>, document.getElementById("root"));
