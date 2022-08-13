import {NamePlate} from "../../components/nameplate";
import {TemplateH260} from "./templates/H260";

export default () => {
	return (
		<TemplateH260 race>
			<NamePlate
				kind='runners'
				index={0}
				cutTop
				style={{
					position: "absolute",
					top: "690px",
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
					top: "690px",
					left: "968px",
					width: "937px",
					height: "50px",
				}}
				race
			></NamePlate>
			<div
				style={{
					position: "absolute",
					color: "black",
					backgroundColor: "rgb(255, 255, 168)",
					top: 0,
					left: "50%",
					fontSize: "26px",
					padding: "0 30px",
					height: "50px",
					display: "grid",
					placeContent: "center",
					placeItems: "center",
					transform: "translateX(-50%)",
					whiteSpace: "nowrap",
				}}
			>
				RTA中に使用する特殊なテクニックにより、一部で光が激しく点滅する場面がございます。
			</div>
		</TemplateH260>
	);
};
