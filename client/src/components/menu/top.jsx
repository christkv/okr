import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import SearchBar from '../search';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  componentWillUnmount: function(e) {
  },
  // <Navbar className='top_menu_bar'>
  //   <Navbar.Header>
  //     <Navbar.Brand>
  //       <a href="#">Home</a>
  //     </Navbar.Brand>
  //     <Navbar.Toggle />
  //   </Navbar.Header>
  //   <Navbar.Collapse>
  //     <Nav>
  //       <NavItem eventKey={2} href="#">Team</NavItem>
  //     </Nav>
  //     <Nav pullRight>
  //       <NavItem eventKey={2} href="#">Log out</NavItem>
  //     </Nav>
  //   </Navbar.Collapse>
  // </Navbar>
  // <nav className="navbar navbar-default" role="navigation">
  //     <div className="navbar-header">
  //         <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
  //             <span className="sr-only">Toggle navigation</span>
  //             <span className="icon-bar"></span>
  //             <span className="icon-bar"></span>
  //             <span className="icon-bar"></span>
  //         </button>
  //         <a className="navbar-brand" href="#">OKR</a>
  //     </div>
  //     <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
  //         <ul className="nav navbar-nav">
  //             <li className="active"><a href="#">Link</a></li>
  //             <li><a href="#">Link</a></li>
  //         </ul>
  //         <div className="col-sm-3 col-md-3 pull-right">
  //             <form className="navbar-form" role="search">
  //                 <div className="input-group">
  //                     <input type="text" className="form-control" placeholder="Search" name="q"/>
  //                     <div className="input-group-btn">
  //                         <button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
  //                     </div>
  //                 </div>
  //             </form>
  //         </div>
  //     </div>
  // </nav>

  // <Navbar className='top_menu_bar'>
  //   <Navbar.Header>
  //     <Navbar.Brand>
  //       <a href="#">Home</a>
  //     </Navbar.Brand>
  //   </Navbar.Header>
  //   <Navbar.Collapse>
  //     <Nav>
  //       <NavItem eventKey={2} href="#">Team</NavItem>
  //     </Nav>
  //     <Nav pullRight>
  //       <NavItem eventKey={2} href="#">Log out</NavItem>
  //     </Nav>
  //   </Navbar.Collapse>
  // </Navbar>

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
