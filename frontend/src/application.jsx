import React from 'react';
import co from 'co';
import Errors from './components/error';

export default React.createClass({
  getInitialState: function() {
    return {
      errors: []
    };
  },

  // Component became visible
  componentDidMount: function() {
    var self = this;

    co(function*() {
      yield self.props.store.connect('http://localhost:9090');
    }).catch(function(e) {
      console.log("!!!!!!!!!!!!!!!!!! YO")
      // Add the error
      self.state.errors.push(e);
      // Update the state
      self.setState({errors: self.state.errors});
    });
  },

  render: function() {
    return (
      <Errors
        errors={this.state.errors}
      />
    );
  }
});
