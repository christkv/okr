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
    // // Simulate AJAX request
    // setTimeout(() => {
    //   const suggestions = matches[Object.keys(matches).find((partial) => {
    //     return searchTerm.match(new RegExp(partial), 'i');
    //   })] || ['macbook', 'macbook air', 'macbook pro'];
    //
    //   resolve(suggestions.filter((suggestion) =>
    //     suggestion.match(new RegExp('^' + searchTerm.replace(/\W\s/g, ''), 'i'))
    //   ));
    // }, 25);
  },

  onKeyUp: function(e) {
  },

  onSearch: function(searchTerm) {
    console.log("------------------------------------- onSearch")
    // if (!searchTerm) return;
    // console.log(`Searching "${searchTerm}"`);
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
          label={label}
        />
      </div>
    );
  }
});
