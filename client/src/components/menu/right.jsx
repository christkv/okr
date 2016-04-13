import React from 'react';
import List from '../comment/list';
import Sidebar from 'react-sidebar';

// var Menu = require('react-burger-menu').slide,
  // List = require('../comment/list');

export default React.createClass({
  getInitialState: function() {
    return {sidebarOpen: true};
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  render: function() {
    var sidebarContent = <b>Sidebar content</b>;

    console.log("------------------------------ render sidebart")
    console.dir(this.props)
    // <List
    //   data={this.props.comments}
    //   user={this.props.user}
    // />

    return (
      <Sidebar sidebar={sidebarContent}
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}>
            <div>hello</div>
      </Sidebar>
    );
  }
});
