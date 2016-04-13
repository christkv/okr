import React from 'react';
import List from '../comment/list';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Comments List', module)
  .add('view', () => {
    var comments = {
      id: 5,
      comments: [{
        id: 1,
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
      }, {
        id: 2,
        avatar: 'https://a1.memecaptain.com/src_thumbs/6023.gif',
        created: new Date(),
        from: 'Peter Peterson',
        from_username: 'peter',
        message: 'hello mate',
        resolved: true
      }]
    };

    var user = {
      username: 'christkv',
      name: 'Christian Kvalheim',
      avatar: 'https://chinesefontdesign.com/wp-content/uploads/2013/09/s.gif'
    }

    return (
      <div className="comments">
        <List
          data={comments}
          user={user}
          onReply={action('onReply')}
          onEdit={action('onEdit')}
          onComment={action('onComment')}
          onResolved={action('onResolved')}
          onCancel={action('onCancel')}
          onDelete={action('onDelete')}
        />
      </div>
    );
  });
