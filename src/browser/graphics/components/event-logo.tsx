import {CSSProperties} from "react";
import rtaijLogo from "../images/header_rij.svg";

export const EventLogo = (props: {style: CSSProperties}) => {
	return (
		<img
			src={rtaijLogo}
			width={350}
			height={150}
			style={{
				...props.style,
			}}
		></img>
	);
};
