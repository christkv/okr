import React from 'react';
import {Button, ButtonToolbar, Image, Row, Col} from 'react-bootstrap';
import { Router, Route, Link, browserHistory } from 'react-router';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  componentWillUnmount: function(e) {
  },

  // Render the component
  render: function() {
    console.log("== left menu render")
    console.log(this.props.user)

    console.log("== manager")
    console.log(this.props.user.managers)

    // Default values
    var manager = ( <span/> );
    var team = ( <span/> );
    var report = ( <span/> );

    //
    // User
    //
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

    //
    // Managers
    //
    if(this.props.user.managers && this.props.user.managers) {
      // Render the managers
      var managers = this.props.user.managers.map(function(manager, index) {
        return (<Row key={index}>
          <Col md={2}>
            <Image circle src={manager.avatar} className='avatar_min'/>
          </Col>
          <Col md={10}>
            <Link to={`/user/${manager.username}`}>{manager.name}</Link>
          </Col>
        </Row>)
      });

      // Do we have a manager
      if(managers.length > 0)
        manager = ( <Row>
           <div className='manager header'>
             <h5>Managers</h5>
             {managers}
           </div>
          </Row> );
    }

    //
    // Teams
    //
    if(this.props.user.teams && this.props.user.teams) {
      // Render the teams
      var teams = this.props.user.teams.map(function(team, index) {
        var members = team.members.map(function(member, index) {
          return (<Row key={index}>
            <Col md={2}>
              <Image circle src={member.avatar} className='avatar_min'/>
            </Col>
            <Col md={10}>
              <Link to={`/user/${member.username}`}>{member.name}</Link>
            </Col>
          </Row>);
        });

        // Render the team
        return (<Row key={index}>
          <Col md={2}>
            <Image circle src={team.avatar} className='avatar_min'/>
          </Col>
          <Col md={10}>
            <h6>{team.name}</h6>
            {members}
          </Col>
        </Row>)
      });

      // Do we have a manager
      if(teams.length > 0)
        team = ( <Row>
           <div className='team header'>
             <h5>In Teams</h5>
             {teams}
           </div>
          </Row> );
    }

    //
    // Reports
    //
    if(this.props.user.reports && this.props.user.reports) {
      // Render the managers
      var reports = this.props.user.reports.map(function(report, index) {
        return (<Row key={index}>
          <Col md={2}>
            <Image circle src={report.avatar} className='avatar_min'/>
          </Col>
          <Col md={10}>
            <Link to={`/user/${report.username}`}>{report.name}</Link>
          </Col>
        </Row>)
      });

      // Do we have a manager
      if(reports.length > 0)
        report = ( <Row>
           <div className='manager header'>
             <h5>Reports</h5>
             {reports}
           </div>
          </Row> );
    }


    // Render the modal dialog
    return (
      <div className='left_menu_bar'>
        {user}
        {manager}
        {team}
        {report}
      </div>
    );
  }
});
