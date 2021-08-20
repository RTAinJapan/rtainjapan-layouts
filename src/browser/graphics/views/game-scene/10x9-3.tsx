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
					top: "612px",
					left: "15px",
					width: "620px",
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
					top: "612px",
					left: "650px",
					width: "620px",
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
					top: "612px",
					left: "1285px",
					width: "620px",
					height: "50px",
				}}
				race
			></NamePlate>
		</TemplateH300>
	);
};
