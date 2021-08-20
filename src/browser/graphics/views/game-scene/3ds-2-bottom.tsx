import {TemplateL420} from "./templates/L420";
import {NamePlate} from "../../components/nameplate";
import {CSSProperties} from "react";

const nameplateStyle: CSSProperties = {
	position: "absolute",
	top: "200px",
	width: "335px",
	height: "50px",
};

export default () => {
	return (
		<TemplateL420 race>
			<NamePlate
				kind='runners'
				index={0}
				style={{left: "463px", ...nameplateStyle}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				style={{left: "1192px", ...nameplateStyle}}
				race
			></NamePlate>
		</TemplateL420>
	);
};
