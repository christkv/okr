import React from 'react';
import co from 'co';
import Form from './form';
import Comment from './comment';
import DeleteDialog from './delete';
import Actions from '../../store/constants';
import {dispatch} from '../utils';

var mergeWithContext = function(self, object) {
  var context = {context: self.props.context || {}};
  return Object.assign(object, context);
}

export default React.createClass({
  getInitialState: function() {
    return {}
  },

  onReply: function(e) {
    dispatch(this.props, Actions.COMMENT_REPLY, mergeWithContext(this, e));
  },

  onEdit: function(e) {
    dispatch(this.props, Actions.COMMENT_EDIT, mergeWithContext(this, { comment_id: e.id, text: e.text }));
  },

  onReplyEdit: function(e) {
    dispatch(this.props, Actions.COMMENT_REPLY_EDIT, mergeWithContext(this, { comment_id: e.comment_id, id: e.id, text: e.reply }));
  },

  onDelete: function(e) {
    this.setState({delete: true, deleteEntry: e});
  },

  onDeleteConfirmed: function(e) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! onDeleteConfirmed")
    console.dir(this.state.deleteEntry)
    if(this.state.deleteEntry.type == 'reply') {
      dispatch(this.props, Actions.COMMENT_REPLY_DELETE, mergeWithContext(this, { comment_id: this.state.deleteEntry.comment_id, id: this.state.deleteEntry.id }));
    } else {
      dispatch(this.props, Actions.COMMENT_DELETE, mergeWithContext(this, { comment_id: this.state.deleteEntry.id }));
    }

    // Set state to delete
    this.setState({delete: false, deleteEntry: null});
  },

  closeModal: function() {
    this.setState({delete:false, deleteEntry: null});
  },

  onResolved: function(e) {
    dispatch(this.props, Actions.COMMENT_RESOLVED, mergeWithContext(this, e));
  },

  render: function() {
    var comments = this.props.comments || [];
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
