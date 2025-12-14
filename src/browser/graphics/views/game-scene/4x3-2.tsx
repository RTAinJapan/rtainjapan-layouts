import {TemplateH260} from "./templates/H260";
import {NamePlate} from "../../components/nameplate";

export default () => {
	return (
		<TemplateH260 race>
			<NamePlate
				variant='single'
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "690px",
					left: "52px",
					width: "900px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				variant='single'
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "690px",
					left: "968px",
					width: "900px",
					height: "50px",
				}}
				race
			></NamePlate>
		</TemplateH260>
	);
};
