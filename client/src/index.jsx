import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/app';
import './app.css'

var data = [
  [1, 2, 3],
  ['one', 'two', 'three']
]

setTimeout(function() {
  data.push(['more', 'data', 'addded']);
  console.log("!!!!!!!!!!!!!!! added row")
}, 1000)

// Render the application
ReactDOM.render(
  <App />,
  document.getElementById('app')
);
