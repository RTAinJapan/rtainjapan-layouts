import {TemplateL420} from "./templates/L420";
import {NamePlate} from "../../components/nameplate";
import {VerticalGameInfo} from "../../components/game-info/vertical";

export default () => {
	return (
		<TemplateL420 race hideGameInfo>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{
					position: "absolute",
					top: "458px",
					left: "1185px",
					width: "720px",
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
					top: "928px",
					left: "450px",
					width: "720px",
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
					top: "928px",
					left: "1185px",
					width: "720px",
					height: "50px",
				}}
				race
			></NamePlate>
			<VerticalGameInfo
				bg
				wide
				style={{
					position: "absolute",
					left: "450px",
					top: "150px",
					width: "720px",
					height: "238px",
				}}
			></VerticalGameInfo>
		</TemplateL420>
	);
};
