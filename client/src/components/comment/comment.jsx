import React from 'react';
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
      reply:false
    }
  },

  onReplyClicked: function() {
    console.log("onReplyClicked ----");
  },

  onReply: function() {
    console.log("onReply ----");
    this.setState({reply:false});
  },

  onFocus: function(e) {
    console.log("onFocus ----")
    this.setState({reply:true});
  },

  onBlur: function(e) {
    console.log("onBlur ----")
    console.log(e)
    this.setState({reply:false});
  },

  onClick: function(e) {
    console.log("onClick ----")
    if(e.target.type != 'button' && e.target.type != 'textarea') {
      this.setState({reply:false});
    }
  },

  render: function() {
    console.log(this.props.data)
    var comment = this.props.data || {};
    var user = this.props.user || {};
    // Build the list of replies if any
    var replies = comment.replies || [];
    // Render all the replies
    var replyObjects = replies.map(function(reply) {
      return (
        <Reply key={reply.id} data={reply}/>
      )
    });

    // Render the reply buttons
    var replyButtons = this.state.reply
      ? (
        <div className='row comment_reply_box_buttons'>
          <div className='col-xs-1'>
          </div>
          <div className='col-xs-11'>
            <ButtonToolbar>
              <Button bsStyle="primary" bsSize="small" onClick={this.onReply}>Reply</Button>
              <Button bsStyle="default" bsSize="small" onClick={this.onBlur}>Cancel</Button>
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
              <div className='col-xs-12'
                dangerouslySetInnerHTML={renderMarkdown(comment.message)} >
              </div>
            </div>
            <div className='row comment_operations_row'>
              <div className='col-xs-12'>
                <a href="#" onClick={this.onReplyClicked}>Reply</a>
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
                  <Textarea onFocus={this.onFocus} minRows={1} placeholder='Add a comment' />
                </div>
              </div>
            </div>
            {replyButtons}
          </div>
        </div>
    );
  }
});
