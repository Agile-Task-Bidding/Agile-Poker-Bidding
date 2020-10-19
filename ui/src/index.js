import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root/root';
import store, { history } from './data/state/store';

ReactDOM.render(
  <React.StrictMode>
    <Root store={store} history={history} />
  </React.StrictMode>,
  document.getElementById('root')
);