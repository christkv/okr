var React = require('react');
var Sidebar = require('react-sidebar').default;
import { storiesOf, action } from '@kadira/storybook';
import { Button } from 'react-bootstrap';

var App = React.createClass({
  getInitialState: function() {
    return {sidebarOpen: false};
  },

  onSetSidebarOpen: function(open) {
    // this.setState({sidebarOpen: open});
  },

  onClick: function(e) {
    this.setState({sidebarOpen:true});
  },

  onClose: function(e) {
    this.setState({sidebarOpen:false});
  },

  render: function() {
    var sidebarContent = (
      <div>
        <b>Sidebar content</b>
        <Button onClick={this.onClose}>Close</Button>
      </div>
    );

    return (
      <div>
      <Sidebar sidebar={sidebarContent}
               shadow={false}
               pullRight={true}
               open={this.state.sidebarOpen}
               onSetOpen={this.onSetSidebarOpen}>
        <Button onClick={this.onClick}>Open</Button>
      </Sidebar>
      </div>
    );
  }
});

storiesOf('Side Bar', module)
  .add('basic', () => {
    // var objective = {
    //   id: 1,
    //   objective: 'objective 1',
    //   tags: ['core'],
    //
    //   keyResults: [{
    //     id: 5,
    //     completeness: 45,
    //     keyResult: 'first key result',
    //     tags: ['mandatory']
    //   }, {
    //     id: 6,
    //     completeness: 15,
    //     keyResult: 'second key result'
    //   }]
    // };
    //
    return (
      <div className="objective1">
        <App />
      </div>
    );
  })
