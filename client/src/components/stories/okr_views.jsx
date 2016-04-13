import React from 'react';
import MainContainer from '../containers/main';
import { storiesOf, action } from '@kadira/storybook';
import Store from '../../store';

storiesOf('Main Container', module)
  .add('user views own okr no managment responsibility', () => {

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
      }
    };

    // Create a new store
    var store = new Store();

    // Render the preview
    return (
      <div className="objective1">
        <MainContainer
          user={userObject}
          store={store}
        />
      </div>
    );
  })
