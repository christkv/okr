import React from 'react';
import co from 'co';
import {Image, ButtonToolbar, Button} from 'react-bootstrap';
import marked from 'marked';
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
    return { edit:false, reply: this.props.data.message || '' }
  },

  onEditClicked: function(e) {
    this.setState({edit:true});
  },

  onDeleteClicked: function(e) {
    if(this.props.onDelete) this.props.onDelete(this.props.data.id);
  },

  onEditSave: function(e) {
    // Fire off the save event
    if(this.props.onEdit) this.props.onEdit({ id: this.props.data.id, reply: this.state.reply });
    // Turn off the edit mode
    this.setState({edit:false});
  },

  onEditCancel: function(e) {
    this.setState({edit:false, reply: this.props.data.message || ''});
  },

  onEditFocus: function(e) {
  },

  onEditChange: function(e) {
    this.setState({reply: e.target.value});
  },

  render: function() {
    // Comment passed
    var reply = this.props.data || {};
    // Unpack the current user
    var user = this.props.user || {};
    var username = this.props.user.username;
    var currentUser = username == reply.from_username;
    // Edit button
    var editButton = currentUser ? ( <a href="#" onClick={this.onEditClicked}>Edit</a> ) : ( <div/> );
    // Delete button
    var deleteButton = currentUser ? ( <a href="#" onClick={this.onDeleteClicked}>Delete</a> ) : ( <div/> );

    // Buttons for message editing
    var editButtons = this.state.edit
      ? (
        <div className='row comment_edit_box_buttons'>
          <div className='col-md-12'>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small" onClick={this.onEditSave}>Save</Button>
              <Button bsStyle="default" bsSize="small" onClick={this.onEditCancel}>Cancel</Button>
            </ButtonToolbar>
          </div>
        </div>
      )
      : (<div/>);

    // Either show editor or render the text
    var message = this.state.edit
      ? ( <Textarea ref='editTextarea' onFocus={this.onEditFocus} onChange={this.onEditChange} minRows={1} value={this.state.reply}/> )
      : ( <div dangerouslySetInnerHTML={renderMarkdown(this.state.reply)} /> );

    // Render the reply
    return (
        <div className='row reply'>
          <div className='col-md-2'>
            <Image src={reply.avatar} rounded className='avatar_min'/>
          </div>
          <div className='col-md-10'>
            <div className='row'>
              <div className='col-md-12 from'>
                {reply.from}
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                {message}
              </div>
            </div>
            {editButtons}
            <div className='row'>
              <div className='col-md-12 reply_date'>
                {formatDate(reply.created)}
                {editButton}
                {deleteButton}
              </div>
            </div>
          </div>
        </div>
    );
  }
});
