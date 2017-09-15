import React from 'react';
import ReactDOM from 'react-dom';
import './docs/index.css';
import App from './docs/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
