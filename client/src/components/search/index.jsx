import React from 'react';
import SearchBar from './search_bar';
import Actions from '../../store/constants';
import {dispatch} from '../utils';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  // Component became visible
  componentDidMount: function() {
  },

  onChange: function(searchTerm, resolve) {
    if(this.props.onChange) {
      this.props.onChange(searchTerm, function(suggestions) {
        resolve(suggestions);
      });
    }
  },

  onKeyUp: function(e) {
  },

  onSearch: function(searchTerm) {
    dispatch(this.props, Actions.SEARCH_BAR_SUBMIT, {searchTerm: searchTerm});
  },

  // Render the component
  render: function() {
    var label = this.props.label || 'Submit';
    // Render the modal dialog
    return (
      <div>
        <SearchBar
          onChange={this.onChange}
          onSearch={this.onSearch}
          onSubmit={this.onSearch}
          onKeyUp={this.onKeyUp}
          disableButton={this.props.disableButton}
          placeholder={this.props.placeholder}
          label={label}
        />
      </div>
    );
  }
});
