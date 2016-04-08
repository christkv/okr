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
      comment: this.props.data.message
    }
  },

  onReplyClicked: function() {
    // Render the buttons
    this.setState({reply:true});
    // Set focus on textarea
    ReactDOM.findDOMNode(this.refs.replyTextarea).focus();
  },

  onEditClicked: function(e) {
    this.setState({edit:true, reply:false});
  },

  onEditChange: function(e) {
    this.setState({comment: e.target.value});
  },

  onReplyChange: function(e) {
    this.setState({replyText: e.target.value});
  },

  onEditFocus: function(e) {
    this.setState({edit:true, reply:false});
  },

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

  onFocus: function(e) {
    this.setState({reply:true});
  },

  onBlur: function(e) {
    this.setState({reply:false});
  },

  onReplyCancel: function(e) {
    this.setState({reply:false, replyText: ''});
  },

  onEditBlur: function() {
    this.setState({reply:false, edit:false});
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
    var replyObjects = replies.map(function(reply) {
      return ( <Reply key={reply.id} data={reply}/> )
    });

    // Either show editor or render the text
    var message = this.state.edit
      ? ( <Textarea ref='editTextarea' onFocus={this.onEditFocus} onChange={this.onEditChange} minRows={1} value={this.state.comment}/> )
      : ( <div dangerouslySetInnerHTML={renderMarkdown(this.state.comment)} /> );

    // Edit button
    var editButton = currentUser
      ? ( <a href="#" onClick={this.onEditClicked}>Edit</a> )
      : ( <div/> );

    // Render the reply buttons
    var replyButtons = this.state.reply
      ? (
        <div className='row comment_reply_box_buttons'>
          <div className='col-xs-1'>
          </div>
          <div className='col-xs-11'>
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
          <div className='col-xs-12'>
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
          <div className='col-xs-1'>
            <Image src={comment.avatar} rounded className='avatar'/>
          </div>
          <div className='col-xs-11'>
            <div className='row comment_row'>
              <div className='col-xs-4 from'>
                {comment.from}
              </div>
              <div className='col-xs-4 reply_date'>
                {formatDate(comment.created)}
              </div>
              <div className='col-xs-4'>
                {comment.from}
              </div>
            </div>
            <div className='row comment_row'>
              <div className='col-xs-12'>
                {message}
              </div>
            </div>
            {editButtons}
            <div className='row comment_operations_row'>
              <div className='col-xs-12'>
                <ButtonToolbar>
                  <a href="#" onClick={this.onReplyClicked}>Reply</a>
                  {editButton}
                </ButtonToolbar>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                {replyObjects}
              </div>
            </div>
            <div className='row comment_reply_box'>
              <div className='inner'>
                <div className='col-xs-1'>
                  <Image src={user.avatar} rounded className='avatar_min'/>
                </div>
                <div className='col-xs-11'>
                  <Textarea ref='replyTextarea' onFocus={this.onFocus} onChange={this.onReplyChange} value={this.state.replyText} minRows={1} placeholder='Add a comment' />
                </div>
              </div>
            </div>
            {replyButtons}
          </div>
        </div>
    );
  }
});
