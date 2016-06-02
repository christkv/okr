import React from 'react';
import Errors from 'react-errors';

export default React.createClass({
  // Set the intial state
  getInitialState: function() {
    return {errors: []};
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({errors: nextProps.errors || []});
  },

  // Component became visible
  componentDidMount: function() {
    var interval = this.props.interval || 5000;
    // Create an interval to automatically timeout errors
    var intervalId = setInterval(() => {
      if(this.state.errors.length > 0) {
        this.state.errors.shift();
        this.setState({errors: this.state.errors});
      }
    }, interval);

    // Update the state intervalId
    this.setState({intervalId: intervalId});
  },

  componentWillUnmount: function() {
    if(this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
  },

  // Render the error component
  render: function() {
    // Handle the user clicking close on the error
    var handleErrorClose = (index) => {
      const newErrors = this.state.errors.slice();
      newErrors.splice(index, 1);
      this.setState({ errors: newErrors });
    }

    return (
      <Errors
        errors={this.state.errors}
        onErrorClose={handleErrorClose}
      />
    )
  }
});
