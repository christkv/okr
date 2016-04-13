import React from 'react';
import {Button, ButtonToolbar, Image, Row, Col} from 'react-bootstrap';
import LeftMenu from '../menu/left';
import TopMenu from '../menu/top';
import SearchBar from '../search';
import OKR from '../okr';
import List from '../comment/list';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
  },

  render: function() {
    return (
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
              <SearchBar label='Search'/>
            </Row>
            <Row>
              <Col md={9}>
                <OKR
                  store={this.props.store}
                  params={{userId:1}}/>
              </Col>
              <Col md={3}>
                <List
                  data={this.props.user.comments}
                  user={this.props.user.user}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
});
