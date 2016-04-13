import React from 'react';
import {Button, ButtonToolbar, Image, Row, Col} from 'react-bootstrap';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  componentWillUnmount: function(e) {
  },

  // Render the component
  render: function() {
    // Do we have a manager
    var manager = this.props.manager
      ? ( <Row>
          <div className='manager header'>
            <h5>Manager</h5>
            <Col md={2}>
              <Image circle src={this.props.manager.avatar} className='avatar_min'/>
            </Col>
            <Col md={10}>
              {this.props.manager.name}
            </Col>
          </div>
        </Row> )
      : ( <span/> );

    // Reports
    var reports = this.props.reports
      ? this.props.reports.map(function(report) {
        return (
          <Row className='report header'>
            <Col md={2}>
              <Image circle src={report.avatar} className='avatar_min'/>
            </Col>
            <Col md={10}>
              {report.name}
            </Col>
          </Row>
        );
      })
      : ( <span/> );

    // Create the label
    var label = this.props.team ? 'Team Members' : 'Reports';

    // Reports view
    var report = this.props.reports
      ? ( <Row>
            <div className='reports header'>
              <h5>{label}</h5>
              {reports}
            </div>
          </Row> )
      : ( <span/> );

    var user = this.props.user
      ? ( <Row>
          <Col md={3}>
            <Image circle src={this.props.user.avatar} className='avatar_max'/>
          </Col>
          <Col md={9}>
            <Row>
              <Col md={12}>
                <h4>{this.props.user.name}</h4>
                <h5>{this.props.user.title}</h5>
              </Col>
            </Row>
          </Col>
        </Row> )
      : ( <span/> );

    var team = this.props.team
      ? ( <Row className='header'>
          <Col md={2}>
            <Image circle src={this.props.team.avatar} className='avatar_max'/>
          </Col>
          <Col md={10}>
            <Row>
              <Col md={12}>
                <h5>Team</h5>
                <h4>{this.props.team.title}</h4>
              </Col>
            </Row>
          </Col>
        </Row> )
      : ( <span/> );

    // Render the modal dialog
    return (
      <div className='left_menu_bar'>
        {team}
        {user}
        {manager}
        {report}
      </div>
    );
  }
});
