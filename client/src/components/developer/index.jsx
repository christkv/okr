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
        <Main store={store} {...this.props}/>
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
        // Get the backend
        var mongoClient = store.backend.client;

        // Delete all the users
        yield mongoClient.db('okr').collection('users').deleteMany({});
        yield mongoClient.db('okr').collection('teams').deleteMany({});
        yield mongoClient.db('okr').collection('okrs').deleteMany({});
        yield mongoClient.db('okr').collection('tags').deleteMany({});
        yield mongoClient.db('okr').collection('objectives').deleteMany({});

        // Add some tags
        var results = yield mongoClient.db('okr').collection('tags').insertMany([{
          text: 'mandatory'
        }, {
          text: 'important'
        }]);

        // Add a team
        var results = yield mongoClient.db('okr').collection('teams').insertMany([{
          username: 'nodejs',
          name: 'Node.js team',
          members: ['ole']
        }]);

        // Insert a user an hierarchy
        yield mongoClient.db('okr').collection('users').insertMany([{
            username: 'ole', name: 'Ole Peterson', title: 'Developer',
            roles: ['user'], avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg',
            reporting: {
              managers: ['peter', 'anders'],
              manages: {
                people: [], teams: []
              },
              teams: ['nodejs']
            }
          }, {
            username: 'peter', name: 'Peter Peterson', title: 'Lead',
            roles: ['user'], avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg',
            reporting: {
              managers: ['boss'],
              manages: {
                people: [], teams: ['nodejs']
              },
              teams: ['leads']
            }
          }, {
            username: 'anders', name: 'Anders Anderson', title: 'Lead',
            roles: ['user'], avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg',
            reporting: {
              managers: ['boss'],
              manages: {
                people: ['ole'], teams: ['nodejs']
              },
              teams: ['leads']
            }
          },
        ]);

        // Insert objectives
        yield mongoClient.db('okr').collection('objectives').insertMany([{
          _id: 1,
          okr_id: 1,
          objective: 'objective 1',
          tags: ['core'],
          keyResults: [{
            id: 5,
            completeness: 45,
            keyResult: 'first key result',
            tags: ['mandatory']
          }, {
            id: 6,
            completeness: 15,
            keyResult: 'second key result'
          }]
        }])

        // Insert some OKR's
        yield mongoClient.db('okr').collection('okrs').insertMany([{
          _id: 1,
          username: 'ole',
          active: true,
          auth: [{
            rights: ['edit'],
            username: 'ole'
          }]
        }]);

        // Setup a scenario for a valid user as user view
        if('user-as-user') {
        }

        browserHistory.push(user)
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
          <li><a href="#" onClick={this.navigate('/user/anders', 'manager-as-user')}>View Manager Anders as Anders</a></li>
          <li><a href="#" onClick={this.navigate('/user/ole', 'user-as-manager')}>View User Ole as Manager</a></li>
        </ul>
      </div>
    )
  }
});
