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
          <div className='manager'>
            <h5>Manager</h5>
            <hr/>
            <Col xs={1}>
              <Image circle src={this.props.manager.avatar} className='avatar_min'/>
            </Col>
            <Col xs={11}>
              {this.props.manager.name}
            </Col>
          </div>
        </Row> )
      : ( <span/> );

    // Reports
    var reports = this.props.reports
      ? this.props.reports.map(function(report) {
        return (
          <Row className='report'>
            <Col xs={1}>
              <Image circle src={report.avatar} className='avatar_min'/>
            </Col>
            <Col xs={11}>
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
            <div className='reports'>
              <h5>{label}</h5>
              <hr/>
              {reports}
            </div>
          </Row> )
      : ( <span/> );

    var user = this.props.user
      ? ( <Row>
          <Col xs={1}>
            <Image circle src={this.props.user.avatar} className='avatar_max'/>
          </Col>
          <Col xs={11}>
            <Row>
              <Col xs={12}>
                <h4>{this.props.user.name}</h4>
                <h5>{this.props.user.title}</h5>
              </Col>
            </Row>
          </Col>
        </Row> )
      : ( <span/> );

    var team = this.props.team
      ? ( <Row>
          <Col xs={1}>
            <Image circle src={this.props.team.avatar} className='avatar_max'/>
          </Col>
          <Col xs={11}>
            <Row>
              <Col xs={12}>
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
