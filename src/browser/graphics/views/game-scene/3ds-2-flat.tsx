import {TemplateL420} from "./templates/L420";
import {NamePlate} from "../../components/nameplate";

export default () => {
	return (
		<TemplateL420>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{top: "865px", left: "537px", width: "556px", height: "50px"}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				cutTop
				style={{top: "865px", left: "1263px", width: "556px", height: "50px"}}
				race
			></NamePlate>
		</TemplateL420>
	);
};
