import {TemplateH300} from "./templates/H300";
import {NamePlate} from "../../components/nameplate";

export default () => {
	return (
		<TemplateH300 race>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{
					position: "absolute",
					top: "596px",
					left: "15px",
					width: "937px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				cutTop
				style={{
					position: "absolute",
					top: "596px",
					left: "968px",
					width: "937px",
					height: "50px",
				}}
				race
			></NamePlate>
		</TemplateH300>
	);
};
