import {TemplateL480} from "./templates/L480";
import {NamePlate} from "../../components/nameplate";
import {CSSProperties} from "react";

const nameplateStyle: CSSProperties = {
	position: "absolute",
	width: "690px",
	height: "50px",
};

export default () => {
	return (
		<TemplateL480 race>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{
					top: "407px",
					left: "510px",
					...nameplateStyle,
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				cutTop
				style={{
					top: "407px",
					left: "1215px",
					...nameplateStyle,
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={2}
				cutTop
				style={{
					top: "861px",
					left: "892px",
					...nameplateStyle,
				}}
				race
			></NamePlate>
		</TemplateL480>
	);
};
