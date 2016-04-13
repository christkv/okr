import React from 'react';
import {Button, ButtonToolbar, Image, Row, Col} from 'react-bootstrap';
import LeftMenu from '../menu/left';
import SearchBar from '../search';
import OKR from '../okr';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
  },

  render: function() {
    return (
      <div className='mainContainer'>
        <Row>
          <Col xs={2}>
            <LeftMenu
              user={this.props.user.user}
              manager={this.props.user.manager}
            />
          </Col>
          <Col xs={10}>
            <Row>
              <SearchBar label='Search'/>
            </Row>
            <Row>
              <OKR store={this.props.store} params={{userId:1}}/>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
});
