import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import Store from '../../store';
import co from 'co';
import Main from '../containers/main';

// CSS files
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import '../../app.css';

// The store
var store = new Store();

// OKRWrapper
var MainWrapper = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <span>
        <a href='/'>Back</a>
        <Main store={store} params={this.props.params}/>
      </span>
    );
  }
});

export default React.createClass({
  getInitialState: function() {
    return {loaded:false};
  },

  // Component became visible
  componentDidMount: function() {
    co(function*() {
      yield store.connect('http://localhost:9090');
    }).catch(function(e) {
      console.log(e.stack);
    });
  },

  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path="/user/:userId" component={MainWrapper}/>
        <Route path="/" component={Menu}/>
      </Router>
    );
  }
});

var Menu = React.createClass({
  getInitialState: function() {
    return {data: []};
  },

  // Component became visible
  componentDidMount: function() {
    co(function*() {
      yield store.connect();
    });
  },

  navigate: function(user) {
    return function() {
      browserHistory.push('/user/ole')
    }
  },

  render: function() {
    return (
      <div>
        <ul>
          <li><a href="#" onClick={this.navigate('/user/ole', 'user-as-user')}>View User Ole as Ole</a></li>
          <li><a href="#" onClick={this.navigate('/user/ole', 'user-as-manager')}>View User Ole as Manager</a></li>
        </ul>
      </div>
    )
  }
});
