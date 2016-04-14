import React from 'react';
import SearchBar from './search_bar';

// const matches = {
//   'macbook a': [
//     'macbook air 13 case',
//     'macbook air 11 case',
//     'macbook air charger'
//   ],
//   'macbook p': [
//     'macbook pro 13 case',
//     'macbook pro 15 case',
//     'macbook pro charger'
//   ]
// };

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
    if(this.props.onSearch) this.props.onSearch(searchTerm);
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
