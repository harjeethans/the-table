import React from 'react';
import ReactDOM from 'react-dom';
import './docs/index.css';
import App from './docs/Docs';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
