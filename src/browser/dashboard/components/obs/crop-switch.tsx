import {
	FormControl,
	FormControlLabel,
	FormGroup,
	Paper,
	Switch,
} from "@material-ui/core";
import React from "react";

export class CropSwitch extends React.Component<{
	cropEnabled: boolean;
}> {
	public render() {
		const cropEnabled = this.props.cropEnabled;

		return (
			<div>
				<Paper
					style={{
						padding: "8px",
					}}
				>
					<FormControl>
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										name='cropEnable'
										checked={cropEnabled}
										onChange={this.handleChangeSwitch}
									/>
								}
								label='ゲーム切り替え時にクロップをリセットする'
							/>
						</FormGroup>
					</FormControl>
				</Paper>
			</div>
		);
	}

	private handleChangeSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.checked
			? nodecg.sendMessage("obs:enableCrop")
			: nodecg.sendMessage("obs:disableCrop");
	};
}
