import {CSSProperties, useRef} from "react";
import fukidashi from "../../images/fukidasi.svg";
import {background} from "../../styles/colors";
import {DonationMessage} from ".";
import {Power2, gsap} from "gsap";

export const InGameDonationPopup = (props: {
	rows: number;
	style?: CSSProperties;
	middleCursor?: boolean;
}) => {
	const containerRef = useRef(null);

	const showPopup = () => {
		const element = containerRef.current;
		const tl = gsap.timeline();
		tl.fromTo(
			element,
			{
				clipPath: "inset(0 100% 0 0)",
				opacity: 0,
			},
			{
				clipPath: "inset(0 0% 0 0)",
				opacity: 1,
				duration: 0.6,
				ease: Power2.easeOut,
			},
		);

		return tl;
	};

	const hidePopup = () => {
		const element = containerRef.current;
		const tl = gsap.timeline();
		tl.to(element, {
			opacity: 0,
			duration: 0.6,
			ease: Power2.easeOut,
		});
	};

	return (
		<div
			ref={containerRef}
			style={{
				display: "grid",
				gridTemplateColumns: "20px auto",
				gap: 0,
				opacity: 0,
				...props.style,
			}}
		>
			<img
				src={fukidashi}
				width={20}
				style={{
					marginTop: props.middleCursor ? "60px" : "37px",
					minWidth: 0,
				}}
			/>
			<div
				style={{
					background: background.donation,
					borderRadius: "10px",
					padding: "0 15px 10px 15px",
				}}
			>
				<DonationMessage
					rows={props.rows}
					onShow={showPopup}
					onComplete={hidePopup}
				/>
			</div>
		</div>
	);
};
