import React from 'react';
import co from 'co';
import {Image} from 'react-bootstrap';
import marked from 'marked';

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
    return {}
  },

  render: function() {
    var comment = this.props.data || {};

    return (
        <div className='row reply'>
          <div className='col-xs-1'>
            <Image src={comment.avatar} rounded className='avatar_min'/>
          </div>
          <div className='col-xs-11'>
            <div className='row'>
              <div className='col-xs-12 from'>
                {comment.from}
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12' dangerouslySetInnerHTML={renderMarkdown(comment.message)}>
              </div>
            </div>
            <div className='row'>
            <div className='col-xs-12 reply_date'>
              {formatDate(comment.created)}
            </div>
            </div>
          </div>
        </div>
    );
  }
});
