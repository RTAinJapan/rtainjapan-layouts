import {Button, Paper, TextField} from '@material-ui/core';
import React from 'react';

export class ObsConnect extends React.Component<{
	connected: boolean;
	obsConfig: {
		host: string;
		port?: number;
		password?: string;
	};
}> {
	public render() {
		const obsConfig = this.props.obsConfig;
		const connected = this.props.connected;

		return (
			<div>
				<Paper
					style={{
						padding: '8px',
						display: 'grid',
						gridAutoFlow: 'row',
						rowGap: '8px',
					}}
				>
					<TextField
						label='Host'
						value={obsConfig.host}
						disabled={!connected}
						InputProps={{
							readOnly: true,
						}}
					></TextField>
					<TextField
						label='Port'
						value={obsConfig.port}
						disabled={!connected}
						InputProps={{
							readOnly: true,
						}}
					></TextField>
					<TextField
						label='Password'
						value={obsConfig.password}
						disabled={!connected}
						InputProps={{
							readOnly: true,
						}}
						type='password'
					></TextField>
					{connected ? (
						<Button
							variant='contained'
							disabled={!obsConfig}
							onClick={this.disconnect}
						>
							切断
						</Button>
					) : (
						<Button
							variant='contained'
							disabled={!obsConfig}
							onClick={this.connect}
						>
							接続
						</Button>
					)}
				</Paper>
			</div>
		);
	}

	private readonly connect = () => {
		nodecg.sendMessage('obs:connect');
	};

	private readonly disconnect = () => {
		nodecg.sendMessage('obs:disconnect');
	};
}
