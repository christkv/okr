import React from 'react';
import co from 'co';
import {Image, Input, Button, ButtonToolbar} from 'react-bootstrap';
import Textarea from 'react-textarea-autosize';
import Comment from './comment';
import DeleteDialog from './delete';
import Actions from '../../store/constants';
import {dispatch} from '../utils';

var mergeWithContext = function(self, object) {
  var context = { context: self.props.context || {}, user: self.props.user };
  return Object.assign(object, context);
}

export default React.createClass({
  getInitialState: function() {
    return { commentText: '', comment: true, view: '' }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({ commentText: '' });
  },

  onCancel: function(e) {
    dispatch(this.props, Actions.COMMENT_FORM_CANCEL, mergeWithContext(this, {}));
  },

  onComment: function(e) {
    dispatch(this.props, Actions.COMMENT_FORM_SUBMIT, mergeWithContext(this, {text: this.state.commentText}));
  },

  onFocus: function(e) {
  },

  onReply: function(e) {
    if(this.props.onReply) this.props.onReply(e);
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

  closeModal: function() {
    this.setState({delete:false, deleteEntry: null});
  },

  onResolved: function(e) {
    if(this.props.onResolved) this.props.onResolved(e);
  },

  render: function() {
    var user = this.props.user || {};
    var comment = this.props.comment;

    // If we have a comment
    if(comment && Object.keys(comment).length > 0) {
      return (
        <div className="comment_form">
          <Comment
            data={comment}
            user={user}
            onReply={this.onReply}
            onReplyEdit={this.onReplyEdit}
            onEdit={this.onEdit}
            onResolved={this.onResolved}
            onDelete={this.onDelete} />
          <DeleteDialog
            isOpen={this.state.delete}
            label={"Delete this comment thread ?"}
            closeModal={this.closeModal}
            onDelete={this.onDeleteConfirmed}
          />
        </div>
      );
    }

    // Disabled button
    var disabled = this.state.commentText.length == 0;
    // Render the reply buttons
    var commentButtons = this.state.comment
      ? (
        <div className='row'>
          <div className='col-xs-12'>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small" onClick={this.onComment} disabled={disabled}>Comment</Button>
              <Button bsStyle="default" bsSize="small" onClick={this.onCancel}>Cancel</Button>
            </ButtonToolbar>
          </div>
        </div>
      )
      : (<div/>);

    // Render the full form
    return (
      <div className='comment comment_form'>
        <div className='row comment'>
          <div className='col-xs-1'>
            <Image src={user.avatar} rounded className='avatar'/>
          </div>
          <div className='col-xs-11 from'>
            {user.name}
          </div>
        </div>
        <div className='row comment_comment_box'>
          <div className='inner'>
            <div className='col-xs-12'>
              <Textarea ref='commentTextarea' onFocus={this.onFocus} onChange={(e) => {
                this.setState({commentText: e.target.value});
              }} value={this.state.commentText} minRows={1} placeholder='Add a comment' />
            </div>
          </div>
        </div>
        {commentButtons}
      </div>
    );
  }
});
