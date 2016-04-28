import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import Store from '../../store';
import co from 'co';
import Main from '../containers/main';
import Errors from 'react-errors';
import Actions from '../../store/constants';

// CSS files
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import '../../app.css';

// The store
var store = new Store();

// OKRWrapper
var MainWrapper = React.createClass({
  getInitialState: function() {
    return { errors: [] };
  },

  dispatch(event, message) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!! dispatch :: " + event)
    console.log(message)

    if(event == Actions.ERROR) {
      this.state.errors.push(message.error);
      this.setState({ errors: this.state.errors });
    } else if(event == Actions.OKR_NAVIGATION_CHANGE){
      if(message.type == 'user') {
        browserHistory.push(`/user/${message.username}`);
      }
    }
  },

  handleErrorClose(index) {
    const newErrors = this.state.errors.slice();
    newErrors.splice(index, 1);
    this.setState({ errors: newErrors });    
  },

  render: function() {
    return (
      <span>
        <a href='/'>Back</a>
        <Main
          dispatch={this.dispatch}
          store={store}
          {...this.props}
        />
        <Errors
          errors={this.state.errors}
          onErrorClose={this.handleErrorClose}
        />
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

        // // Drop the database
        // yield mongoClient.db('okr').command({dropDatabase:true});
        // // Create the text index on the objectives
        // yield mongoClient.db('okr').command({
        //   createIndexes: 'objectives', indexes: [{
        //     key: {objective: 'text', 'keyResults.keyResult': 'text'},
        //     name: 'objective_text'
        //   }]
        // });

        // // Create the text index on the objectives
        // yield mongoClient.db('okr').command({
        //   createIndexes: 'users', indexes: [{
        //     key: {username: 'text', name: 'text'},
        //     name: 'user_text'
        //   }]
        // });

        // // Create the text index on the objectives
        // yield mongoClient.db('okr').command({
        //   createIndexes: 'teams', indexes: [{
        //     key: {username: 'text', name: 'text'},
        //     name: 'team_text'
        //   }]
        // });

        // Delete all the users
        yield mongoClient.db('okr').collection('users').deleteMany({});
        yield mongoClient.db('okr').collection('teams').deleteMany({});
        yield mongoClient.db('okr').collection('okrs').deleteMany({});
        yield mongoClient.db('okr').collection('tags').deleteMany({});
        yield mongoClient.db('okr').collection('objectives').deleteMany({});
        yield mongoClient.db('okr').collection('comments').deleteMany({});

        // Add some tags
        var results = yield mongoClient.db('okr').collection('tags').insertMany([
          { text: 'mandatory' },
          { text: 'important' }]);

        // Add a team
        var results = yield mongoClient.db('okr').collection('teams').insertMany([{
          username: 'nodejs', name: 'Node.js team', members: ['ole']
        }]);

        // Insert a user an hierarchy
        yield mongoClient.db('okr').collection('users').insertMany([{
            username: 'ole', name: 'Ole Peterson', title: 'Developer',
            roles: ['user'], avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg',
            reporting: {
              managers: ['peter', 'anders'],
              manages: { people: [], teams: [] },
              teams: ['nodejs']
            }
          }, {
            username: 'peter', name: 'Peter Peterson', title: 'Lead',
            roles: ['user'], avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg',
            reporting: {
              managers: ['boss'],
              manages: { people: [], teams: ['nodejs'] },
              teams: ['leads']
            }
          }, {
            username: 'anders', name: 'Anders Anderson', title: 'Lead',
            roles: ['user'], avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg',
            reporting: {
              managers: ['boss'],
              manages: { people: ['ole'], teams: ['nodejs'] },
              teams: ['leads']
            }
          },
        ]);

        // Insert comments
        yield mongoClient.db('okr').collection('comments').insertMany([{
          _id: 1,
          objective_id: 1,
          avatar: 'http://38.media.tumblr.com/avatar_b388702f3728_128.png',
          created: new Date(),
          from: 'Christian Kvalheim',
          from_username: 'christkv',
          message: 'hello mate, **how** are you',
          resolved: false,
        }]);

        // Insert objectives
        yield mongoClient.db('okr').collection('objectives').insertMany([{
          _id: 1, okr_id: 1, objective: 'objective 1', tags: ['core'],
          keyResults: [
            { id: 5, completeness: 45, keyResult: 'first key result', tags: ['mandatory'] },
            { id: 6, completeness: 15, keyResult: 'second key result' } ]
        }, {
          _id: 2, okr_id: 2, objective: 'team objective 1', tags: ['core'],
          keyResults: [
            { id: 1, completeness: 0, keyResult: 'node.js key result 1', tags: ['mandatory'] },
            { id: 2, completeness: 0, keyResult: 'node.js key result 2' } ]
        }, {
          _id: 3, okr_id: 2, objective: 'team objective 2', tags: ['core'],
          keyResults: [
            { id: 1, completeness: 0, keyResult: 'node.js key result 3' },
            { id: 2, completeness: 0, keyResult: 'node.js key result 4' } ]
        }])

        // Insert some OKR's
        yield mongoClient.db('okr').collection('okrs').insertMany([{
          _id: 1, username: 'ole', name:'Ole Peterson', type: 'user', active: true
        }, {
          _id: 2, username: 'nodejs', name:'Node.js team', type: 'team', active: true
        }, {
          _id: 3, username: 'anders', name:'Anders Anderson', type: 'user', active: true
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
