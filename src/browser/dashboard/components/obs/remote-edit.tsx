import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const RowContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 64px;
	grid-gap: 4px;
`;

interface Props {
	browsers: string[];
	browserIndex: number;
	repBrowser: string;
	repViewId: string;
}

interface State {
	viewId: string;
}

export class RemoteEdit extends React.Component<Props, State> {
	state: State = {viewId: ''};

	componentDidUpdate(prevProps: Props) {
		if (prevProps.repViewId === this.props.repViewId) {
			return;
		}
		this.setState({
			viewId: this.props.repViewId,
		});
	}

	public render() {
		return (
			<Paper
				style={{
					display: 'grid',
					gridAutoFlow: 'row',
					rowGap: '8px',
					padding: '8px',
				}}
			>
				<FormControl variant='outlined'>
					<InputLabel id='browser-select-label'>
						ブラウザソース選択
					</InputLabel>
					<Select
						id='browser-select'
						labelId='browser-select-label'
						onChange={this.handleChangeBrowser}
						value={this.props.repBrowser}
					>
						<MenuItem value=''>選択なし</MenuItem>
						{this.props.browsers.map((browser, index) => (
							<MenuItem value={browser} key={index}>
								{browser}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<RowContainer>
					<TextField
						label='view='
						variant='outlined'
						value={this.state.viewId}
						onChange={this.handleChangeViewId}
					></TextField>
					<Button variant='contained' onClick={this.submitViewId}>
						反映
					</Button>
				</RowContainer>
			</Paper>
		);
	}

	private handleChangeBrowser = (
		event: React.ChangeEvent<{value: unknown}>,
	) => {
		nodecg.sendMessage('obs:setRemoteSource', {
			input: event.target.value as string,
			index: this.props.browserIndex,
		});
	};

	private handleChangeViewId = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			viewId: e.target.value,
		});
	};

	private submitViewId = () => {
		nodecg.sendMessage('obs:updateRemoteBrowser', {
			viewId: this.state.viewId,
			index: this.props.browserIndex,
		});
	};
}
