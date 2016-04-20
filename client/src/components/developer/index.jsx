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

  navigate: function(user, role) {
    return function() {
      co(function*(){
        console.log("--------------------------------- navigate :: " + user + " :: " + role)
        // Setup a scenario for a valid user as user view
        if('user-as-user') {
          console.log("----------- navigate 0")
          // Get the backend
          var mongoClient = store.backend.client;
          console.log("----------- navigate 1")
          // Insert a user
          var result = yield mongoClient.db('okr').collection('users').updateOne({
            username:'christkv'
          }, {
            $set: {
              username: 'ole',
              name: 'Ole Peterson',
              title: 'Lead',
              roles: ['admin'],
              avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg'
            }
          }, {upsert:true});
          console.log("----------- navigate 2")


          browserHistory.push('/user/ole')
        }

      }).catch(function(e) {
        console.log(e.stack)
      });
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
