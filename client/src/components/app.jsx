import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import OKR from './okr';

var DataRow = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var entries = this.props.data.map(function(entry, index) {
      return (
        <td key={index}>{entry}</td>
      );
    });

    return (
      <tr className="dataRow">
        {entries}
      </tr>
    );
  }
});

var DataList = React.createClass({
  render: function() {
    var entries = this.props.data.map(function(entry) {
      return (
        <DataRow key={entry.id} data={entry.data}/>
      )
    });

    return (
      <table className="dataList">
        <tbody>
          {entries}
        </tbody>
      </table>
    );
  }
});

var Button = React.createClass({
  render: function() {
    return (
      <input type='button' onClick={this.props.onClick} value={this.props.name}/>
    );
  }
});

var id = 1

var App = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  addData: function() {
    this.state.data.push(
      {id: id++, data: [1, 2, 3]}
    );

    this.setState(this.state);
  },
  render: function() {
    return (
      <div id="app" className="app">
        <h1>Application</h1>
        <DataList data={this.state.data} />
        <Button onClick={this.addData} name='Add Data'/>
        <Link to={`/about`}>About</Link>,
        <Link to={`/user/ole`}>User</Link>
      </div>
    );
  }
});

var About = React.createClass({
  render: function() {
    return (
      <div id="about" className="about">
        <h1>About</h1>
        <Link to={`/`}>Application</Link>
      </div>
    );
  }
});

var Users = React.createClass({
  render: function() {
    return (
      <div id="about" className="about">
        <h1>Users</h1>
        <div className="detail">
          {this.props.children}
        </div>
      </div>
    );
  }
});

var User = React.createClass({
  render: function() {
    return (
      <div id="about" className="about">
        <h1>User</h1>
      </div>
    );
  }
});

export default React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  addData: function() {
    this.state.data.push(
      {id: id++, data: [1, 2, 3]}
    );

    this.setState(this.state);
  },
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}></Route>
        <Route path="about" component={About}/>
        <Route path="/user/:userId" component={OKR}/>
      </Router>
    );
  }
});
