import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import ReactDOM from 'react-dom';

interface TmpRunner {
	name: string;
	twitch?: string;
	twitter?: string;
	nico?: string;
}

interface State {
	tmpRunners: TmpRunner[];
	tmpName: string;
	tmpTwitch: string;
	tmpTwitter: string;
	tmpNico: string;
}

const Description: React.FC = () => (
	<div>
		<div>
			現在のゲームの走者欄を、事前に登録しておいたものにワンクリックで入れ替える機能です
		</div>
		<div>
			この画面を更新すると登録されたものはすべて消えるの気をつけてください
		</div>
	</div>
);

const TmpRunnerContainer: React.FC<{
	tmpRunners: TmpRunner[];
	onSelect(index: number, runner: TmpRunner): void;
}> = (props) => {
	return (
		<Paper>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>名前</TableCell>
						<TableCell>Twitter</TableCell>
						<TableCell>Twitch</TableCell>
						<TableCell>ニコニコ</TableCell>
						<TableCell />
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{props.tmpRunners.map((runner) => (
						<TableRow>
							<TableCell>{runner.name}</TableCell>
							<TableCell>{runner.twitter}</TableCell>
							<TableCell>{runner.twitch}</TableCell>
							<TableCell>{runner.nico}</TableCell>
							<TableCell>
								<Button
									variant='contained'
									onClick={() => {
										props.onSelect(0, runner);
									}}
								>
									走者0に使う
								</Button>
							</TableCell>
							<TableCell>
								<Button
									variant='contained'
									onClick={() => {
										props.onSelect(1, runner);
									}}
								>
									走者1に使う
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	);
};

class App extends React.Component<{}, State> {
	state = {
		tmpRunners: [],
		tmpName: '',
		tmpTwitch: '',
		tmpNico: '',
		tmpTwitter: '',
	};
	currentRunRep = nodecg.Replicant('current-run');

	render() {
		return (
			<div
				style={{
					display: 'grid',
					gridAutoFlow: 'row',
					rowGap: '16px',
				}}
			>
				<Description />
				<TmpRunnerContainer
					tmpRunners={this.state.tmpRunners}
					onSelect={(index, runner) => {
						if (!this.currentRunRep.value) {
							return;
						}
						if (index !== 0 && index !== 1) {
							return;
						}
						this.currentRunRep.value.runners[index] = runner;
					}}
				/>
				<Paper
					style={{
						padding: '8px',
						display: 'grid',
						gridAutoFlow: 'row',
						rowGap: '8px',
					}}
				>
					<TextField
						label='名前'
						value={this.state.tmpName}
						onChange={(e) => {
							this.setState({tmpName: e.target.value});
						}}
					/>
					<TextField
						label='Twitter'
						value={this.state.tmpTwitter}
						onChange={(e) => {
							this.setState({tmpTwitter: e.target.value});
						}}
					/>
					<TextField
						label='Twitch'
						value={this.state.tmpTwitch}
						onChange={(e) => {
							this.setState({tmpTwitch: e.target.value});
						}}
					/>
					<TextField
						label='ニコニコ'
						value={this.state.tmpNico}
						onChange={(e) => {
							this.setState({tmpNico: e.target.value});
						}}
					/>
					<Button
						variant='contained'
						onClick={() => {
							this.setState(
								(state) => ({
									tmpRunners: [
										...state.tmpRunners,
										{
											name: state.tmpName,
											nico: state.tmpNico,
											twitter: state.tmpTwitter,
											twitch: state.tmpTwitch,
										},
									],
								}),
								() => {
									this.setState({
										tmpName: '',
										tmpNico: '',
										tmpTwitch: '',
										tmpTwitter: '',
									});
								},
							);
						}}
					>
						追加
					</Button>
				</Paper>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('edit-tourny'));
