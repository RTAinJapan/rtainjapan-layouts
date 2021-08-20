import {TemplateH260} from "./templates/H260";
import {NamePlate} from "../../components/nameplate";

export default () => {
	return (
		<TemplateH260 race>
			<NamePlate
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "498px",
					left: "120px",
					width: "441px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "498px",
					left: "1020px",
					width: "441px",
					height: "50px",
				}}
				race
			></NamePlate>
		</TemplateH260>
	);
};
