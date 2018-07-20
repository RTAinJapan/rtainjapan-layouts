import '../lib/react-devtools';
import React from 'react';
import ReactDom from 'react-dom';

import {App} from './app';
import {twitterCallback} from './lib/twitter-callback';

document.body.style.margin = '0'
document.body.style.padding = '0'

twitterCallback();
ReactDom.render(<App />, document.getElementById('app'));
