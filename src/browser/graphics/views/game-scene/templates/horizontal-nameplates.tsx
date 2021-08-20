import {CSSProperties} from "react";
import {useCommentators} from "../../../components/lib/hooks";
import {NamePlate} from "../../../components/nameplate";

const NamePlateGroup = ({race}: {race?: boolean}) => {
	const commentators = useCommentators();

	if (race) {
		return (
			<>
				{commentators.slice(0, 2).map((commentator, index) => (
					<NamePlate
						kind='commentators'
						key={commentator.name}
						index={index}
						style={{width: "400px"}}
					></NamePlate>
				))}
			</>
		);
	}

	if (commentators.length === 0) {
		return <NamePlate kind='runners' style={{width: "400px"}}></NamePlate>;
	}

	if (commentators.length === 1) {
		return (
			<>
				<NamePlate kind='runners' style={{width: "400px"}}></NamePlate>
				<NamePlate kind='commentators' style={{width: "400px"}}></NamePlate>
			</>
		);
	}

	return (
		<>
			<NamePlate kind='runners' style={{width: "400px"}}></NamePlate>
			<NamePlate
				kind='commentators'
				index={[0, 1]}
				style={{width: "515px"}}
			></NamePlate>
		</>
	);
};

export const HorizontalNamePlates = (props: {
	race?: boolean;
	style?: CSSProperties;
}) => {
	return (
		<div
			style={{
				position: "absolute",
				left: "500px",
				top: "900px",
				width: "515px",
				height: "115px",
				display: "grid",
				gap: "15px",
				gridAutoFlow: "row",
				alignContent: "end",
				alignItems: "stretch",
				justifyItems: "end",
				...props.style,
			}}
		>
			<NamePlateGroup race={props.race}></NamePlateGroup>
		</div>
	);
};
