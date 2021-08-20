import {TemplateL420} from "./templates/L420";
import {NamePlate} from "../../components/nameplate";

export default () => {
	return (
		<TemplateL420 race>
			<NamePlate
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "608px",
					left: "463px",
					width: "345px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "608px",
					left: "1192px",
					width: "345px",
					height: "50px",
				}}
				race
			></NamePlate>
		</TemplateL420>
	);
};
