import "../styles/global";

import {FC} from "react";
import {useCurrentRun} from "../../graphics/components/lib/hooks";
import {render} from "../../render";

const App: FC = () => {
	const currentRun = useCurrentRun();
	if (!currentRun) {
		return null;
	}
	const runners = currentRun.runners;

	return (
		<div>
			<div>走者0: {runners[0] && runners[0].name}</div>
			<div>走者1: {runners[1] && runners[1].name}</div>
		</div>
	);
};

render(<App />);
