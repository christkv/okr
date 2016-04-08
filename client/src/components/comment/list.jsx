import React from 'react';
import co from 'co';
import Comment from './comment';
import Form from './form';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  render: function() {
    var comments = this.props.data.comments || [];
    var user = this.props.user || {};

    // Generate the objects
    var commentObjects = comments.map(function(x) {
      return (
        <div className='comment'>
          <Comment key={x.id} data={x} user={user}/>
          <hr/>
        </div>
      );
    });

    return ( <div>
        { commentObjects }
      </div> );
  }
});
