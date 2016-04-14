import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import SearchBar from '../search';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  componentWillUnmount: function(e) {
  },

  // Render the component
  render: function() {
    // Render the modal dialog
    return (
      <Navbar className='top_menu_bar'>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Home</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Team</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Log Out</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
});
