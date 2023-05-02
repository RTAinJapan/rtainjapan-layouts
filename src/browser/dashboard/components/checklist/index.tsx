import FormControlLabel from "@material-ui/core/FormControlLabel";
import {FC} from "react";
import styled from "styled-components";
import {useCurrentRun} from "../../../graphics/components/lib/hooks";
import {useReplicant} from "../../../use-replicant";
import {BorderedBox} from "../lib/bordered-box";
import {Checkbox} from "./Checkbox";

const Container = styled(BorderedBox)`
	padding: 16px;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: 1fr;
	grid-gap: 8px;
	user-select: none;
`;

const CurrentRunNameRow = styled.div`
	text-align: center;
	grid-column: 1 / 3;
`;

export const Checklist: FC = () => {
	const currentRun = useCurrentRun();
	const nextRun = useReplicant("next-run");
	const checklist = useReplicant("checklist");
	const timer = useReplicant("timer");

	if (!currentRun || !checklist || !timer) {
		return null;
	}

	const setupNext =
		timer.timerState === "Running" || timer.timerState === "Finished";
	const targetRun = setupNext && nextRun ? nextRun : currentRun;

	return (
		<Container>
			<CurrentRunNameRow>
				{setupNext ? "次のゲーム" : "現在のゲーム"} - {targetRun?.title}
			</CurrentRunNameRow>
			{checklist?.map((checklist) => {
				const complete = targetRun.completedChecklist.includes(checklist.pk);

				return (
					targetRun && (
						<FormControlLabel
							key={checklist.name}
							control={
								<Checkbox
									runPk={targetRun.pk}
									checklist={checklist}
									complete={complete}
								/>
							}
							label={checklist.name}
							style={{
								margin: "0",
								borderRadius: "3px",
								border: "1px solid black",
							}}
						/>
					)
				);
			})}
		</Container>
	);
};
