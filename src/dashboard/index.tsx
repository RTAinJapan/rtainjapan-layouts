import React from 'react';
import ReactDom from 'react-dom';
import {Checklist} from './components/checklist';

const App = () => <Checklist />;

ReactDom.render(<App />, document.getElementById('app'));
