import React from 'react';
import co from 'co';
import Form from './form';
import Comment from './comment';
import DeleteDialog from './delete';

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
      this.props.onEdit({
        'type': 'comment', comment_id: e.id, text: e.message
      });
    }
  },

  onReplyEdit: function(e) {
    if(this.props.onEdit) {
      this.props.onEdit({
        'type': 'reply', comment_id: e.comment_id, id: e.id, text: e.reply
      });
    }
  },

  onDelete: function(e) {
    this.setState({delete: true, deleteEntry: e});
  },

  onDeleteConfirmed: function(e) {
    // Propegate the delete event
    if(this.props.onDelete) this.props.onDelete(this.state.deleteEntry);
    // Set state to delete
    this.setState({delete: false, deleteEntry: null});
  },

  closeModal: function() {
    this.setState({delete:false, deleteEntry: null});
  },

  onResolved: function(e) {
    if(this.props.onResolved) this.props.onResolved(e);
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
            onReplyEdit={this.onReplyEdit}
            onDelete={this.onDelete} />
          <hr/>
        </div>
      );
    });

    // Return the comments
    return ( <div className='comments_list'>
          { commentObjects }
        <DeleteDialog
          isOpen={this.state.delete}
          label={"Delete this comment thread ?"}
          closeModal={this.closeModal}
          onDelete={this.onDeleteConfirmed}
        />
      </div> );
  }
});
