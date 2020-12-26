import {
	Checkbox,
	FormControl,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	Paper,
	Select,
} from '@material-ui/core';

import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {CropSwitch} from '../components/obs/crop-switch';
import RefreshIcon from '@material-ui/icons/Refresh';

type SceneItem = {
	id: number;
	name: string;
	type: string;
};

type Scene = {
	name: string;
	sources: SceneItem[];
};

interface State {
	connected: boolean;
	cropEnabled: boolean;
	findSceneIndex: number;
	scenes: Scene[];
	cropSourceNames: string[];
}

const Container = styled.div`
	display: grid;
	gridautoflow: row;
	grid-gap: 20px;
`;

const RowContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 64px;
	grid-gap: 4px;
`;

const ListContainer = styled.div`
	padding: 8px;
	display: grid;
	gridautoflow: row;
	grid-gap: 20px;
`;

class App extends React.Component<{}, State> {
	state: State = {
		connected: false,
		cropEnabled: false,
		findSceneIndex: -1,
		scenes: [],
		cropSourceNames: [],
	};
	private readonly obsRep = nodecg.Replicant('obs');
	private readonly obsCropInputsRep = nodecg.Replicant('obs-crop-inputs');

	componentDidMount() {
		this.obsRep.on('change', (newVal) => {
			if (!newVal) {
				return;
			}

			this.setState({
				connected: newVal.connected,
				cropEnabled: newVal.cropEnabled,
				findSceneIndex: 0,
				scenes: newVal.scenes,
			});
		});

		this.obsCropInputsRep.on('change', (newVal) => {
			this.setState({
				cropSourceNames: newVal,
			});
		});
	}
	componentWillUnmount() {
		this.obsRep.removeAllListeners('change');
	}

	public render() {
		return (
			<Container>
				<CropSwitch cropEnabled={this.state.cropEnabled} />
				<Paper
					style={{
						padding: '8px',
						display: 'grid',
						gridAutoFlow: 'column',
						rowGap: '8px',
					}}
				>
					{this.state.connected ? (
						<ListContainer>
							<RowContainer>
								<FormControl variant='outlined'>
									<InputLabel id='scene-select-label'>シーン選択</InputLabel>
									<Select
										id='scene-select'
										labelId='scene-select-label'
										value={this.state.findSceneIndex}
										onChange={this.handleChangeFindScene}
									>
										{this.state.scenes.map((scene, index) => (
											<MenuItem value={index} key={index}>
												{scene.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton aria-label='refresh' onClick={this.updateSource}>
									<RefreshIcon />
								</IconButton>
							</RowContainer>
							<List
								style={{
									height: '620px',
									overflowY: 'auto',
								}}
							>
								{!(this.state.findSceneIndex < 0) &&
									this.state.scenes.length > this.state.findSceneIndex &&
									this.state.scenes[this.state.findSceneIndex].sources.map(
										(item) => (
											<ListItem key={item.id}>
												<ListItemText
													primary={item.name}
													secondary={item.type}
												/>
												<ListItemSecondaryAction>
													<Checkbox
														value={item.name}
														checked={this.isSelected(item.name)}
														onChange={this.handleChangeCheck}
													/>
												</ListItemSecondaryAction>
											</ListItem>
										),
									)}
							</List>
						</ListContainer>
					) : (
						<p>OBSに接続されていません。</p>
					)}
				</Paper>
			</Container>
		);
	}

	private updateSource = () => {
		nodecg.sendMessage('obs:update');
	};

	private handleChangeFindScene = (
		event: React.ChangeEvent<{value: unknown}>,
	): void => {
		this.setState({
			findSceneIndex: event.target.value as number,
		});
	};

	private handleChangeCheck = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		event.target.checked
			? nodecg.sendMessage('obs:addCropInput', event.target.value)
			: nodecg.sendMessage('obs:removeCropInput', event.target.value);
	};

	private isSelected = (name: string): boolean => {
		return this.state.cropSourceNames.includes(name);
	};
}

ReactDOM.render(<App />, document.getElementById('root'));
