import {Camera} from "../../../components/camera";
import {useCommentators} from "../../../components/lib/hooks";
import {NamePlate} from "../../../components/nameplate";
import {Sponsor} from "../../../components/sponsor";

export const useVerticalGameInfo = (props: {
	race?: boolean;
	width: string;
	height: string;
	cameraHeight: string;
	cameraHeightRace: string;
	nameplateWidth: string;
	limitOneCommentator?: boolean;
}) => {
	const commentators = useCommentators();

	const runnerNamePlate = props.race ? null : (
		<NamePlate
			kind='runners'
			index={0}
			style={{width: props.nameplateWidth, placeSelf: "center"}}
		></NamePlate>
	);
	const commentatorNamePlate =
		props.limitOneCommentator && commentators.length >= 2 ? (
			<NamePlate
				kind='commentators'
				index={[0, 1]}
				style={{width: props.nameplateWidth, placeSelf: "center"}}
			></NamePlate>
		) : (
			commentators.slice(0, 2).map((commentator, index) => {
				return (
					<NamePlate
						key={commentator.name}
						kind='commentators'
						index={index}
						style={{width: props.nameplateWidth, placeSelf: "center"}}
					></NamePlate>
				);
			})
		);

	const nameplateLength =
		(runnerNamePlate ? 1 : 0) +
		(Array.isArray(commentatorNamePlate) ? commentatorNamePlate.length : 1);

	const gridTemplateRepeat = "50px ".repeat(nameplateLength);

	return (
		<div
			style={{
				position: "absolute",
				left: "15px",
				top: "150px",
				width: props.width,
				height: props.height,
				display: "grid",
				gridTemplateRows: props.race
					? `${props.cameraHeightRace} ${gridTemplateRepeat} 1fr`
					: `${props.cameraHeight} ${gridTemplateRepeat} 1fr`,
				alignContent: "start",
				justifyContent: "stretch",
				gap: "15px",
			}}
		>
			<Camera style={{placeSelf: "stretch"}}></Camera>
			{runnerNamePlate}
			{commentatorNamePlate}
			<Sponsor kind='vertical' style={{placeSelf: "stretch"}}></Sponsor>
		</div>
	);
};
