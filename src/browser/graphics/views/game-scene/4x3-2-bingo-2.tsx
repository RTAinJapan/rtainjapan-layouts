import {NamePlate} from "../../components/nameplate";
import {TemplateV480} from "./templates/V480";

export default () => {
	return (
		<TemplateV480>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				race
				style={{
					position: "absolute",
					top: "457px",
					left: "510px",
					width: "784px",
					height: "50px",
				}}
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				cutTop
				race
				style={{
					position: "absolute",
					top: "964px",
					left: "510px",
					width: "784px",
					height: "50px",
				}}
			></NamePlate>
		</TemplateV480>
	);
};
