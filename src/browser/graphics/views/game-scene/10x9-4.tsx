import {TemplateV480} from "./templates/V480";
import {NamePlate} from "../../components/nameplate";

export default () => {
	return (
		<TemplateV480>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{
					position: "absolute",
					top: "458px",
					left: "708px",
					width: "492px",
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
					top: "458px",
					left: "1215px",
					width: "492px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={2}
				cutTop
				style={{
					position: "absolute",
					top: "965px",
					left: "708px",
					width: "492px",
					height: "50px",
				}}
				race
			></NamePlate>
			<NamePlate
				kind='runners'
				index={3}
				cutTop
				style={{
					position: "absolute",
					top: "965px",
					left: "1215px",
					width: "492px",
					height: "50px",
				}}
				race
			></NamePlate>
		</TemplateV480>
	);
};
