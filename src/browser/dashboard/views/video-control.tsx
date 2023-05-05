import "modern-normalize";
import createTheme from "@mui/material/styles/createTheme";
import LinearProgress from "@mui/material/LinearProgress";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {useReplicant} from "../../use-replicant";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import {ColoredButton} from "../components/lib/colored-button";
import {green, lightBlue, orange, pink} from "@mui/material/colors";
import {VideoControl} from "../../../nodecg/generated";
import {render} from "../../render";

const parseDuration = (seconds: number) => {
	return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
		Math.floor(seconds % 60),
	).padStart(2, "0")}`;
};

const Control = ({control}: {control: VideoControl}) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr 1fr",
				gap: "8px",
			}}
		>
			{control && (
				<>
					<div
						style={{
							gridColumn: "1 / 5",
							textAlign: "center",
						}}
					>
						{parseDuration(control.current)} / {parseDuration(control.duration)}
					</div>
					<LinearProgress
						style={{
							gridColumn: "1 / 5",
						}}
						variant='determinate'
						value={(control.current / control.duration) * 100}
					/>
					<ColoredButton
						color={green}
						ButtonProps={{
							style: {
								gridColumn: nodecg.bundleConfig.preventVideoStop
									? "1 / 5"
									: "2 / 3",
							},
							disabled: control.status === "play",
							onClick: () => {
								nodecg.sendMessage("video:play");
							},
						}}
					>
						<PlayArrowIcon />
					</ColoredButton>
					{!nodecg.bundleConfig.preventVideoStop && (
						<>
							<ColoredButton
								color={lightBlue}
								ButtonProps={{
									style: {
										gridColumn: "1 / 2",
										gridRow: 3,
									},
									onClick: () => {
										nodecg.sendMessage("video:reset");
									},
								}}
							>
								<SkipPreviousIcon />
							</ColoredButton>
							<ColoredButton
								color={orange}
								ButtonProps={{
									style: {
										gridColumn: "3 / 4",
										gridRow: 3,
									},
									disabled: control.status === "pause",
									onClick: () => {
										nodecg.sendMessage("video:pause");
									},
								}}
							>
								<PauseIcon />
							</ColoredButton>
							<ColoredButton
								color={pink}
								ButtonProps={{
									style: {
										gridColumn: "4 / 5",
										gridRow: 3,
									},
									disabled: control.status === "pause",
									onClick: () => {
										nodecg.sendMessage("video:stop");
									},
								}}
							>
								<StopIcon />
							</ColoredButton>
						</>
					)}
				</>
			)}
		</div>
	);
};

const SELECT_DEFAULT = "none";

const theme = createTheme({
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
			},
		},
	},
});

const App = () => {
	const control = useReplicant("video-control");
	const videos = useReplicant("assets:interval-video");

	return (
		<ThemeProvider theme={theme}>
			<div
				style={{
					padding: "8px",
				}}
			>
				<label>動画選択</label>

				<select
					onChange={(e) => {
						nodecg.sendMessage(
							"video:init",
							e.currentTarget.value !== SELECT_DEFAULT
								? e.currentTarget.value
								: null,
						);
					}}
					disabled={control?.status === "play"}
					style={{
						width: "100%",
					}}
					value={control?.path || SELECT_DEFAULT}
				>
					<option value={SELECT_DEFAULT}>-</option>
					{[...(videos || [])]
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((v, idx) => (
							<option key={idx} value={v.url}>
								{v.name}
							</option>
						))}
				</select>
				<div
					style={{
						margin: "8px",
					}}
				>
					<Control control={control} />
				</div>
			</div>
		</ThemeProvider>
	);
};

render(<App />);
