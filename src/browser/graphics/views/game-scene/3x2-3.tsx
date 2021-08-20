import {TemplateL480} from "./templates/L480";
import {NamePlate} from "../../components/nameplate";
import {VerticalGameInfo} from "../../components/game-info/vertical";

export default () => {
	return (
		<TemplateL480 race hideGameInfo>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{
					position: "absolute",
					top: "458px",
					left: "1215px",
					width: "663px",
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
					top: "965px",
					left: "523px",
					width: "663px",
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
					left: "1215px",
					width: "663px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VerticalGameInfo
				wide
				bg
				style={{
					position: "absolute",
					left: "510px",
					top: "150px",
					width: "690px",
					height: "238px",
				}}
			></VerticalGameInfo>
		</TemplateL480>
	);
};
