import {TemplateL480} from "./templates/L480";
import {NamePlate} from "../../components/nameplate";
import {VerticalGameInfo} from "../../components/game-info/vertical";
import {CSSProperties} from "react";

const namePlateStyle: CSSProperties = {
	position: "absolute",
	width: "590px",
	height: "50px",
};

export default () => {
	return (
		<TemplateL480 race hideGameInfo>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{top: "458px", left: "1215px", ...namePlateStyle}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				cutTop
				style={{top: "965px", left: "610px", ...namePlateStyle}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={2}
				cutTop
				style={{top: "965px", left: "1215px", ...namePlateStyle}}
				race
			></NamePlate>
			<VerticalGameInfo
				bg
				wide
				style={{
					position: "absolute",
					left: "510px",
					top: "150px",
					width: "690px",
					height: "238px",
				}}
			></VerticalGameInfo>
		</TemplateL480>
	);
};
