import React from 'react';
import {Button, ButtonToolbar, Image, Row, Col, Glyphicon} from 'react-bootstrap';
import LeftMenu from '../menu/left';
import TopMenu from '../menu/top';
import SearchBar from '../search';
import OKR from '../okr';
import List from '../comment/list';
import {default as SideBar} from 'react-sidebar';
import co from 'co';

export default React.createClass({
  getInitialState: function() {
    return {
      edit: false,
      rate: true,

      sideBarOpen: false,
      _routePath: null,
      comments: [],
      user: {},
      manager: {}
    };
  },

  componentDidUpdate: function() {
    // Get the current path
    var newPath = this.props.location ? this.props.location.pathname : '';
    // Check if the path changed
    if(this.state._routePath !== newPath) {
      this.onRouteChanged({ _routePath: newPath });
    }
  },

  componentDidMount: function() {
    this.onRouteChanged({_routePath: this.props.location ? this.props.location.pathname : ''});
  },

  onRouteChanged: function(state) {
    var self = this;

    co(function*() {
      // Get the navigated to user
      var userId = self.props.params.userId;
      // Grab the user
      var user = yield self.props.store.User().load(userId);
      // Get the current user
      var currentUser = yield self.props.store.User().loadCurrent();

      // Are we in edit mode
      if(user.username == currentUser.username) {
        state.edit = true;
        state.rate = false;
      }

      console.log("------------------------------------ onRouteChanged")
      console.log("user.username = " + user.username)
      console.log("currentUser.username = " + currentUser.username)
      console.log(state)

      // Get the user okr
      var okr = yield self.props.store.OKR().load(user, currentUser);
      // Update the state
      self.setState(Object.assign({user: user, currentUser: currentUser, okr: okr}, state));
    }).catch(function(e) {
      console.log(e.stack)
    });
  },

  commentsButtonClicked: function() {
    this.setState({ sideBarOpen: true });
  },

  onSideBarCloseClicked: function() {
    this.setState({ sideBarOpen: false });
  },

  render: function() {
    var sidebar = (
      <div className='sidebar'>
        <div  className='sidebar_btn_toolbar'>
          <ButtonToolbar>
            <Button onClick={this.onSideBarCloseClicked} bsSize='small'>
              <Glyphicon glyph="align-left" />
            </Button>
          </ButtonToolbar>
        </div>
        <List
          data={this.state.comments}
          user={this.state.user}
        />
      </div>
    );

    // Render the main OKR view
    return (
      <SideBar
        pullRight={true}
        sidebar={sidebar}
        open={this.state.sideBarOpen}
        onSetOpen={this.onSideBarCloseClicked}
      >
        <div className='mainContainer'>
          <TopMenu
            user={this.state.user}
          />
          <Row>
            <Col md={2}>
              <LeftMenu
                user={this.state.user}
                manager={this.state.manager}
              />
            </Col>
            <Col md={10}>
              <Row>
                <SearchBar
                  label='Search'
                  disableButton={true}
                  placeholder='Search for user or team'
                />
              </Row>
              <Row>
                <OKR
                  edit={this.state.edit}
                  rate={this.state.rate}
                  store={this.props.store}
                  currentUser={this.state.currentUser}
                  user={this.state.user}
                  okr={this.state.okr} />
              </Row>
            </Col>
          </Row>
        </div>
      </SideBar>
    );
  }
});
