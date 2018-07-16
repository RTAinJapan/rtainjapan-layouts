// tslint:disable-next-line:no-import-side-effect
import '../lib/react-devtools';
import React from 'react';
import ReactDom from 'react-dom';
import {App} from './app';

import './index.scss';

ReactDom.render(<App />, document.getElementById('app'));
