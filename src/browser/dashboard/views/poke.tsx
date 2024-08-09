import "../styles/global";

import CssBaseline from "@mui/material/CssBaseline";
import {useReplicant} from "../../use-replicant";
import {useState, useEffect} from "react";
import {render} from "../../render";

const pokeRep = nodecg.Replicant("poke");

const App = () => {
	const poke = useReplicant("poke");
	const [pokeState, setPoke] = useState(0);

	useEffect(() => {
		if (poke) {
			setPoke(poke);
		}
	}, [poke]);

	return (
		<div
			style={{
				padding: "8px",
			}}
		>
			<label>ポケモン捕獲数</label>
			<input
				value={pokeState}
				type='number'
				onChange={(e) => {
					setPoke(Number(e.target.value));
				}}
			/>
			<button
				onClick={() => {
					pokeRep.value = pokeState;
				}}
			>
				更新
			</button>
		</div>
	);
};

render(
	<>
		<CssBaseline />
		<App />
	</>,
);
