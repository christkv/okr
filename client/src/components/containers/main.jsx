import React from 'react';
import {Button, ButtonToolbar, Image, Row, Col, Glyphicon} from 'react-bootstrap';
import LeftMenu from '../menu/left';
import TopMenu from '../menu/top';
import SearchBar from '../search';
import OKR from '../okr';
import List from '../comment/list';
import {default as SideBar} from 'react-sidebar';

export default React.createClass({
  getInitialState: function() {
    return { sideBarOpen: false };
  },

  componentDidMount: function() {
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
          data={this.props.user.comments}
          user={this.props.user.user}
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
            user={this.props.user.user}
          />
          <Row>
            <Col md={2}>
              <LeftMenu
                user={this.props.user.user}
                manager={this.props.user.manager}
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
                  commentsButtonClicked={this.commentsButtonClicked}
                  store={this.props.store}
                  params={{userId:1}}/>
              </Row>
            </Col>
          </Row>
        </div>
      </SideBar>
    );
  }
});
