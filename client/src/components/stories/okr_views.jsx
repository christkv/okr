import React from 'react';
import MainContainer from '../containers/main';
import { storiesOf, action } from '@kadira/storybook';
import Store from '../../store';

storiesOf('Main Container', module)
  .add('user views own okr no managment responsibility', () => {
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

    // User
    var userObject = {
      // User information
      user: {
        username: 'christkv',
        name: 'Christian Kvalheim',
        title: 'Lead',
        roles: ['admin'],
        avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg'
      },
      // Manager informatioin
      manager: {
        username: 'paul',
        name: 'Paul Anderson',
        title: 'VP',
        roles: ['admin'],
        avatar: 'http://farm5.static.flickr.com/4050/4234711805_17e9b1ca47_m.jpg'
      },
      comments: comments
    };

    // Create a new store
    var store = new Store();

    // Render the preview
    return (
      <div className="app">
        <MainContainer
          user={userObject}
          store={store}
        />
      </div>
    );
  })
