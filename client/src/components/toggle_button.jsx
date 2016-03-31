import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {values: this.props.values, index: 0};
  },

  onClick: function() {
    // Update the index of the button
    this.state.index = (this.state.index + 1) % this.state.values.length;
    // Update the button state
    this.setState(this.state);
    // Signal the state change to the parent component
    if(this.props.onClick) this.props.onClick(this.state.index);
  },

  render: function() {
    return (
      <button className='btn btn-default' onClick={this.onClick}>{this.state.values[this.state.index]}</button>
    );
  }
})
