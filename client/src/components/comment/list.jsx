import React from 'react';
import co from 'co';
import Form from './form';
import Comment from './comment';

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  onReply: function(e) {
    if(this.props.onReply) {
      this.props.onReply(e);
    }
  },

  onEdit: function(e) {
    if(this.props.onEdit) {
      this.props.onEdit(e);
    }
  },

  render: function() {
    var comments = this.props.data.comments || [];
    var user = this.props.user || {};

    // Generate the objects
    var commentObjects = comments.map((x) => {
      return (
        <div className='comment' key={x.id}>
          <Comment
            data={x} user={user}
            onReply={this.onReply}
            onEdit={this.onEdit}
            onDelete={this.onDelete}
            onResolved={this.onResolved}
            />
          <hr/>
        </div>
      );
    });

    // Return the comments
    return ( <div> { commentObjects } </div> );
  }
});
