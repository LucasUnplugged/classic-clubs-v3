import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';

const rootElement = document.getElementById('app-root');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
