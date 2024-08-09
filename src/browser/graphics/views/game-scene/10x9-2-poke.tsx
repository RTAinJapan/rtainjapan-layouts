import {TemplateH300} from "./templates/H300";
import {ThinText} from "../../components/lib/text";
import {background, border} from "../../styles/colors";
import {useReplicant} from "../../../use-replicant";

export default () => {
	const poke = useReplicant("poke");

	return (
		<TemplateH300>
			<div
				style={{
					height: "50px",
					borderRadius: "7px",
					borderColor: border.name,
					borderStyle: "solid",
					borderWidth: "2px",
					display: "grid",
					gridTemplateColumns: "1fr",
					placeContent: "stretch",
					placeItems: "center",
					background: background.name,
					position: "absolute",
					fontSize: "24px",
					top: "649px",
					left: "1002px",
					width: "690px",
				}}
			>
				<ThinText>捕獲数 {String(poke).padStart(3, "0")}/150</ThinText>
			</div>
		</TemplateH300>
	);
};
