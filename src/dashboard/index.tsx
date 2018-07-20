import '../lib/react-devtools';
import React from 'react';
import ReactDom from 'react-dom';
import {App} from './app';
import {twitterCallback} from './lib/twitter-callback';

twitterCallback();

ReactDom.render(<App />, document.getElementById('app'));
