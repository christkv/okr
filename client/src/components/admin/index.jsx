import React from 'react';
import {Tabs, Tab, Panel, FormControls, Input, Row, Col, Label, ButtonToolbar, Button, Table} from 'react-bootstrap';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import SearchBar from '../search';

require('react-datepicker/dist/react-datepicker.css');

export default React.createClass({
  getInitialState: function() {
    return { key: this.props.selectTab || 1, startDate: moment(), endDate: moment(), searchUsers: [] };
  },

  onSelect: function(key) {
    this.setState({key: key});
  },

  handleChangeStart: function(date) {
    this.setState({ startDate: date });
  },

  handleChangeEnd: function(date) {
    this.setState({ endDate: date });
  },

  onAddOKR: function(e) {
    if(this.props.onAddOKR) this.props.onAddOKR({
      startDate: this.state.startDate, endDate: this.state.endDate
    });
  },

  onOKRDelete: function(e) {
    if(this.props.onOKRDelete) this.props.onOKRDelete({
      id: e.target.dataset.id
    });
  },

  onUserDelete: function(e) {
    if(this.props.onUserDelete) this.props.onUserDelete({
      id: e.target.dataset.id
    });
  },

  onUserMakeAdmin: function(e) {
    if(this.props.onUserMakeAdmin) this.props.onUserMakeAdmin({
      id: e.target.dataset.id
    });
  },

  onCancel: function(e) {
    if(this.props.onCancel) this.props.onCancel();
  },

  onSearchChange: function(searchTerm, callback) {
    const users = this.props.users || [];
    // Match the suggestions
    const suggestions = users.filter((user) => {
      if(user.username.match(new RegExp('^' + searchTerm.replace(/\W\s/g, ''), 'i'))) return true;
      if(user.name.match(new RegExp('^' + searchTerm.replace(/\W\s/g, ''), 'i'))) return true;
      return false;
    }).map((user) => {
      return user.name;
    });

    // Callback
    callback(suggestions);
  },

  onSearch: function(searchTerm) {
    const users = this.props.users || [];

    // Match the suggestions
    const suggestions = users.filter((user) => {
      if(user.username.match(new RegExp('^' + searchTerm.replace(/\W\s/g, ''), 'i'))) return true;
      if(user.name.match(new RegExp('^' + searchTerm.replace(/\W\s/g, ''), 'i'))) return true;
      return false;
    });

    // Update the state
    this.setState({searchUsers: suggestions})
  },

  render() {
    // Unpack the data
    var active = this.props.active;
    var okrs = this.props.okrs || [];
    var adminUsers = this.props.adminUsers || [];

    // Render an active OKR
    var activeOKR = active ? (
      <Panel header={"Active OKR"} className='admin' bsStyle="primary">
        <form className='form-horizontal'>
          <Input label='Start Date' wrapperClassName="wrapper">
            <Col xs={12}>
              <DatePicker className="form-control" label="fiuc"
                selected={this.state.startDate}
                onChange={this.handleChange} />
            </Col>
          </Input>
          <Input label='End Date' wrapperClassName="wrapper">
            <Col xs={12}>
              <DatePicker className="form-control" label="fiuc"
                selected={this.state.startDate}
                onChange={this.handleChange} />
            </Col>
          </Input>
        </form>
      </Panel>
    ) : (
      <Panel header={"No Active OKR"} className='admin' bsStyle="danger">
        No active OKR Period
      </Panel>
    );

    // Render Okrs
    var okrs = okrs.map((okr, index) => {
      var current = moment();
      var buttons = ( <span/> );

      // Check if the dates allow it to be deleted
      if(okr.startDate.isAfter(current)
        && okr.endDate.isAfter(current)) {
          buttons = (
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="xsmall" data-id={okr.id} onClick={this.onOKRDelete}>Delete</Button>
            </ButtonToolbar>
          )
      }

      // Return the okr row
      return (
        <tr key={okr.id}>
          <td>{index + 1}</td>
          <td>{okr.startDate.format()}</td>
          <td>{okr.endDate.format()}</td>
          <td>{buttons}</td>
        </tr>
      );
    });

    // Create admin user components
    var adminUsers = adminUsers.map((user, index) => {
      return (
        <tr key={user.id}>
          <td>{index + 1}</td>
          <td>{user.username}</td>
          <td>{user.name}</td>
          <td>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="xsmall" data-id={user.id} onClick={this.onUserDelete}>Delete</Button>
            </ButtonToolbar>
          </td>
        </tr>
      );
    });

    // Create admin user components
    var searchUsers = this.state.searchUsers || [];
    // Render the users
    searchUsers = searchUsers.map((user, index) => {
      return (
        <tr key={user.id}>
          <td>{index + 1}</td>
          <td>{user.username}</td>
          <td>{user.name}</td>
          <td>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="xsmall" data-id={user.id} onClick={this.onUserMakeAdmin}>Make Admin</Button>
            </ButtonToolbar>
          </td>
        </tr>
      );
    });

    // Render the panel
    return (
      <div>
        <Tabs activeKey={this.state.key} onSelect={this.onSelect}>
          <Tab eventKey={1} title="OKR">
            {activeOKR}
            <Panel header={"New OKR Period"} className='admin okr_admin'>
              <form className='form-horizontal'>
                <Input label='Start/End Date' wrapperClassName="wrapper">
                  <Col xs={6}>
                    <DatePicker className="form-control" label="fiuc"
                      selected={this.state.startDate}
                      onChange={this.handleChangeStart} />
                  </Col>
                  <Col xs={6}>
                    <DatePicker className="form-control" label="fiuc"
                      selected={this.state.startDate}
                      onChange={this.handleChangeEnd} />
                  </Col>
                </Input>
                <ButtonToolbar>
                  <Button bsStyle="primary" bsSize="small" onClick={this.onAddOKR}>Add</Button>
                  <Button bsStyle="default" bsSize="small" onClick={this.onCancel}>Cancel</Button>
                </ButtonToolbar>
              </form>
            </Panel>
            <Panel header={"OKR Periods"} className='admin'>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {okrs}
                </tbody>
              </Table>
            </Panel>
          </Tab>
          <Tab eventKey={2} title="User">
            <Panel header={"User Admin"} className='admin user_admin'>
              <Row>
                <SearchBar
                  label="Search"
                  onChange={this.onSearchChange}
                  onSearch={this.onSearch}
                />
              </Row>
              <Row>
                <Panel className='admin user_admin'>
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User name</th>
                        <th>Name</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchUsers}
                    </tbody>
                  </Table>
                </Panel>
              </Row>
            </Panel>
            <Panel header={"Admin Users"} className='admin'>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User name</th>
                    <th>Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers}
                </tbody>
              </Table>
            </Panel>
          </Tab>
        </Tabs>
      </div>
    );
  }
});
