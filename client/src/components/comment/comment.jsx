import React from 'react';
import ReactDOM from 'react-dom';
import co from 'co';
import {Image, Input, Button, ButtonToolbar} from 'react-bootstrap';
import marked from 'marked';
import Reply from './reply';
import Textarea from 'react-textarea-autosize';

var formatDate = function(d) {
  if(!d) return '';
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dateString = `${d.getHours()}:${d.getMinutes()} ${months[d.getMonth()]} ${d.getDate()}`;
  return dateString;
}

var renderMarkdown = function(comment) {
  return { __html: marked(comment, {sanitize: true}) };
}

export default React.createClass({
  getInitialState: function() {
    return {
      reply: false,
      edit: false,
      replyText: '',
      comment: this.props.data.message || ''
    }
  },

  //
  // Manage State buttons
  onReplyClicked: function() {
    // Render the buttons
    this.setState({reply:true});
    // Set focus on textarea
    ReactDOM.findDOMNode(this.refs.replyTextarea).focus();
  },

  onEditClicked: function(e) {
    this.setState({edit:true, reply:false});
  },

  onDeleteClicked: function(e) {
    if(this.props.onDelete) {
      this.props.onDelete({ type: 'comment', id: this.props.data.id });
    }
  },

  onResolvedClicked: function(e) {
    if(this.props.onResolved) this.props.onResolved(this.props.data.id);
  },

  //
  // Edit of comment changed
  onEditChange: function(e) {
    this.setState({comment: e.target.value});
  },

  //
  // Reply text field changed
  onReplyChange: function(e) {
    this.setState({replyText: e.target.value});
  },

  //
  // Reply text field received focus
  onEditFocus: function(e) {
    this.setState({edit:true, reply:false});
  },

  //
  // Comment edited and saved
  onEditSave: function(e) {
    // Get the edited value
    var message = ReactDOM.findDOMNode(this.refs.editTextarea).value;
    // Set the state of the component
    this.setState({edit:false, reply:false});
    // Fire the onEdit handler
    if(this.props.onEdit) {
      this.props.onEdit({
        id: this.props.data.id,
        message: message
      });
    }
  },

  //
  // Reply added to the comment
  onReply: function() {
    // Disable the button bar
    this.setState({reply:false, replyText: ''});
    // Fire the onReply handler
    if(this.props.onReply) {
      this.props.onReply({
        id: this.props.data.id,
        message: this.state.reply
      });
    }

    // Clean out the text
    ReactDOM.findDOMNode(this.refs.replyTextarea).value = '';
  },

  //
  // Reply changed by the user
  onDeleteReply: function(id) {
    if(this.props.onDelete) {
      this.props.onDelete({ type: 'reply', comment_id: this.props.data.id, id: id });
    }
  },

  onEditReply: function(e) {
    if(this.props.onReplyEdit) this.props.onReplyEdit({
      comment_id: this.props.data.id, id: e.id, reply: e.reply
    });
  },

  //
  // Reply cancel button clicked
  onReplyCancel: function(e) {
    this.setState({reply:false, replyText: ''});
  },

  onFocus: function(e) {
    var state = {reply:true, edit:false};
    // Reset state back to property (it will wipe out the text but it should have)
    // been updated via the parent component setting the property
    if(this.state.edit) state.comment = this.props.data.message || '';
    // Update the state
    this.setState(state);
  },

  onBlur: function(e) {
    this.setState({reply:false});
  },

  onEditBlur: function() {
    this.setState({reply:false, edit:false, comment: this.props.data.message || ''});
  },

  onClick: function(e) {
    if(e.target.type != 'button'
      && e.target.type != 'textarea'
      && e.target.localName != 'a') {
      this.setState({reply:false});
    }
  },

  render: function() {
    var comment = this.props.data || {};
    var user = this.props.user || {};
    var username = this.props.user.username;
    var currentUser = username == comment.from_username;

    // Build the list of replies if any
    var replies = comment.replies || [];

    // Render all the replies
    var replyObjects = replies.map((reply) => {
      return ( <Reply
        user={user}
        key={reply.id}
        data={reply}
        onDelete={this.onDeleteReply}
        onEdit={this.onEditReply}
      /> )
    });

    // Either show editor or render the text
    var message = this.state.edit
      ? ( <Textarea ref='editTextarea' onFocus={this.onEditFocus} onChange={this.onEditChange} minRows={1} value={this.state.comment}/> )
      : ( <div dangerouslySetInnerHTML={renderMarkdown(this.state.comment)} /> );

    // Edit button
    var editButton = currentUser ? ( <a href="#" onClick={this.onEditClicked}>Edit</a> ) : ( <div/> );
    // Delete button
    var deleteButton = currentUser ? ( <a href="#" onClick={this.onDeleteClicked}>Delete</a> ) : ( <div/> );
    // Resolve button
    var resolveButton = currentUser ? ( <a href="#" onClick={this.onResolvedClicked}>Resolve</a> ) : ( <div/> );

    // Render the reply buttons
    var replyButtons = this.state.reply
      ? (
        <div className='row comment_reply_box_buttons'>
          <div className='col-md-1'>
          </div>
          <div className='col-md-11'>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small" onClick={this.onReply}>Reply</Button>
              <Button bsStyle="default" bsSize="small" onClick={this.onReplyCancel}>Cancel</Button>
            </ButtonToolbar>
          </div>
        </div>
      )
      : (<div/>);

    // Buttons for message editing
    var editButtons = this.state.edit
      ? (
        <div className='row comment_edit_box_buttons'>
          <div className='col-md-12'>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small" onClick={this.onEditSave}>Save</Button>
              <Button bsStyle="default" bsSize="small" onClick={this.onEditBlur}>Cancel</Button>
            </ButtonToolbar>
          </div>
        </div>
      )
      : (<div/>);

    // Return the comment component
    return (
        <div className='row comment' onClick={this.onClick}>
          <div className='col-md-2'>
            <Image src={comment.avatar} rounded className='avatar'/>
          </div>
          <div className='col-md-10'>
            <div className='row comment_row'>
              <div className='col-md-4 from'>
                {comment.from}
              </div>
              <div className='col-md-4 reply_date'>
                {formatDate(comment.created)}
              </div>
              <div className='col-md-4'>
                {comment.from}
              </div>
            </div>
            <div className='row comment_row'>
              <div className='col-md-12'>
                {message}
              </div>
            </div>
            {editButtons}
            <div className='row comment_operations_row'>
              <div className='col-md-12'>
                <ButtonToolbar>
                  <a href="#" onClick={this.onReplyClicked}>Reply</a>
                  {editButton}
                  {deleteButton}
                  {resolveButton}
                </ButtonToolbar>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                {replyObjects}
              </div>
            </div>
            <div className='row comment_reply_box'>
              <div className='inner'>
                <div className='col-md-1'>
                  <Image src={user.avatar} rounded className='avatar_min'/>
                </div>
                <div className='col-md-11'>
                  <Textarea ref='replyTextarea'
                    onFocus={this.onFocus}
                    onChange={this.onReplyChange}
                    value={this.state.replyText}
                    minRows={1}
                    placeholder='Add a reply' />
                </div>
              </div>
            </div>
            {replyButtons}
          </div>
        </div>
    );
  }
});
