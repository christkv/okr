import ReactDOM from 'react-dom';
import React from 'react';
import App from './application';
import Store from './store';

// Create the store
var store = new Store();

// Render the application, pass in the store option
ReactDOM.render(
  <App store={store}/>,
  document.getElementById('app')
);
