import {NamePlate} from "../../components/nameplate";
import {TemplateV480} from "./templates/V480";

export default () => {
	return (
		<TemplateV480>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{
					position: "absolute",
					top: "531px",
					left: "510px",
					width: "690px",
					height: "50px",
				}}
			></NamePlate>
			<NamePlate
				kind='runners'
				index={1}
				cutTop
				style={{
					position: "absolute",
					top: "531px",
					left: "1215px",
					width: "690px",
					height: "50px",
				}}
			></NamePlate>
		</TemplateV480>
	);
};
