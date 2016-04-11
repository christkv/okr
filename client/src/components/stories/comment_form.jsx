import React from 'react';
import Form from '../comment/form';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Comment Form', module)
  .add('new comment', () => {
    var comment = {
    };

    var user = {
      username: 'christkv',
      name: 'Christian Kvalheim',
      avatar: 'https://chinesefontdesign.com/wp-content/uploads/2013/09/s.gif'
    };

    return (
      <div className="comments">
        <Form
          user={user}
          comment={comment}
          onComment={action('onComment')}
          onEdit={action('onEdit')}
          onReply={action('onReply')}
          onResolved={action('onResolved')}
          onCancel={action('onCancel')}
          onDelete={action('onDelete')}
        />
      </div>
    );
  })
  .add('view', () => {
    var comment = {
      id: 5,
      avatar: 'http://38.media.tumblr.com/avatar_b388702f3728_128.png',
      created: new Date(),
      from: 'Christian Kvalheim',
      from_username: 'christkv',
      message: 'hello mate, **how** are you',
      resolved: false,

      replies: [{
        id: 10,
        avatar: 'https://a1.memecaptain.com/src_thumbs/6023.gif',
        created: new Date(),
        from: 'Peter Peterson',
        from_username: 'peter',
        to: 'christkv',
        message: 'i completely agree'
      }]
    };

    var user = {
      username: 'christkv',
      name: 'Christian Kvalheim',
      avatar: 'https://chinesefontdesign.com/wp-content/uploads/2013/09/s.gif'
    }

    return (
      <div className="comments">
        <Form
          user={user}
          comment={comment}
          onComment={action('onComment')}
          onEdit={action('onEdit')}
          onReply={action('onReply')}
          onResolved={action('onResolved')}
          onCancel={action('onCancel')}
          onDelete={action('onDelete')}
        />
      </div>
    );
  })
  .add('view reply user', () => {
    var comment = {
      id: 5,
      avatar: 'http://38.media.tumblr.com/avatar_b388702f3728_128.png',
      created: new Date(),
      from: 'Christian Kvalheim',
      from_username: 'christkv',
      message: 'hello mate, **how** are you',
      resolved: false,

      replies: [{
        id: 10,
        avatar: 'https://a1.memecaptain.com/src_thumbs/6023.gif',
        created: new Date(),
        from: 'Peter Peterson',
        from_username: 'peter',
        to: 'christkv',
        message: 'i completely agree'
      }]
    };

    var user = {
      username: 'peter',
      name: 'Peter Peterson',
      avatar: 'https://a1.memecaptain.com/src_thumbs/6023.gif'
    }

    return (
      <div className="comments">
        <Form
          user={user}
          comment={comment}
          onComment={action('onComment')}
          onEdit={action('onEdit')}
          onReply={action('onReply')}
          onResolved={action('onResolved')}
          onCancel={action('onCancel')}
          onDelete={action('onDelete')}
        />
      </div>
    );
  })
