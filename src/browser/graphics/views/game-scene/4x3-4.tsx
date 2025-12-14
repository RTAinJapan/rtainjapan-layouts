import {TemplateV480} from "./templates/V480";
import {NamePlate} from "../../components/nameplate";

export default () => {
	return (
		<TemplateV480>
			<NamePlate
				kind='runners'
				index={0}
				style={{
					position: "absolute",
					top: "458px",
					left: "610px",
					width: "590px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				style={{
					position: "absolute",
					top: "458px",
					left: "1215px",
					width: "590px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={2}
				style={{
					position: "absolute",
					top: "965px",
					left: "610px",
					width: "590px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={3}
				style={{
					position: "absolute",
					top: "965px",
					left: "1215px",
					width: "590px",
					height: "50px",
				}}
				race
			></NamePlate>
		</TemplateV480>
	);
};
