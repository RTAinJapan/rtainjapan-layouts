import "../styles/global";

import CssBaseline from "@mui/material/CssBaseline";
import {useReplicant} from "../../use-replicant";
import {useState, useEffect} from "react";
import {render} from "../../render";
import {FormControlLabel, Switch} from "@mui/material";

const pokeRep = nodecg.Replicant("poke");
const pokeControlRep = nodecg.Replicant("pokemon-control");

const updateUrl = (url: string) => {
	if (!pokeControlRep.value) {
		return;
	}
	pokeControlRep.value.url = url;
};

const updateEnableScraping = (enable: boolean) => {
	if (!pokeControlRep.value) {
		return;
	}
	pokeControlRep.value.enableScraping = enable;
};

const App = () => {
	const poke = useReplicant("poke");
	const [pokeState, setPoke] = useState(0);

	const pokeControl = useReplicant("pokemon-control");

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
			{pokeControl && (
				<>
					<input
						type='text'
						value={pokeControl.url}
						onChange={(e) => {
							updateUrl(e.currentTarget.value);
						}}
						placeholder='URL'
					/>
					<FormControlLabel
						control={
							<Switch
								checked={pokeControl.enableScraping}
								onChange={(e) => {
									updateEnableScraping(e.target.checked);
								}}
							/>
						}
						label='ページから自動取得する'
					/>
				</>
			)}
			<label>ポケモン捕獲数</label>
			<input
				value={pokeState}
				type='number'
				onChange={(e) => {
					setPoke(Number(e.target.value));
				}}
				disabled={pokeControl?.enableScraping}
			/>
			<button
				onClick={() => {
					pokeRep.value = pokeState;
				}}
				disabled={pokeControl?.enableScraping}
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
