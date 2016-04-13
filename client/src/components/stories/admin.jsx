import React from 'react';
import Admin from '../admin';
import { storiesOf, action } from '@kadira/storybook';
import moment from 'moment';

storiesOf('Admin', module)
  .add('admin view', () => {
    var user = {
      username: 'christkv',
      name: 'Christian Kvalheim',
      roles: ['admin'],
      avatar: 'https://chinesefontdesign.com/wp-content/uploads/2013/09/s.gif'
    };

    return (
      <div className="objective1">
        <Admin user={user}
          selectTab={1}
          onAddOKR={action('onAddOKR')}
          onOKRDelete={action('onOKRDelete')}
          onCancel={action('onCancel')}
        />
      </div>
    );
  })
  .add('admin view okrs', () => {
    var user = {
      username: 'christkv',
      name: 'Christian Kvalheim',
      roles: ['admin'],
      avatar: 'https://chinesefontdesign.com/wp-content/uploads/2013/09/s.gif'
    };

    var okrs = [{
      id: 1,
      startDate: moment(),
      endDate: moment()
    }, {
      id: 2,
      startDate: moment().add(7, 'days'),
      endDate: moment().add(14, 'days'),
    }];

    return (
      <div className="objective1">
        <Admin
          user={user}
          okrs={okrs}
          selectTab={1}
          onAddOKR={action('onAddOKR')}
          onOKRDelete={action('onOKRDelete')}
          onCancel={action('onCancel')}
        />
      </div>
    );
  })
  .add('admin view users', () => {
    var user = {
      username: 'christkv', name: 'Christian Kvalheim', roles: ['admin'],
      avatar: 'https://chinesefontdesign.com/wp-content/uploads/2013/09/s.gif'
    };

    var okrs = [{
      id: 1, startDate: moment(), endDate: moment()
    }, {
      id: 2, startDate: moment().add(7, 'days'), endDate: moment().add(14, 'days'),
    }];

    var adminUsers = [{
      id:1, username: 'peter', name: 'Peter Pan'
    }];

    var users = [
      { id:1, username: 'peter', name: 'Peter Pan' },
      { id:2, username: 'dan', name: 'Dan Danielsen' },
      { id:3, username: 'danson', name: 'Daneter Danielsen' }
    ];

    return (
      <div className="objective1">
        <Admin
          user={user}
          users={users}
          adminUsers={adminUsers}
          okrs={okrs}
          selectTab={2}
          onAddOKR={action('onAddOKR')}
          onOKRDelete={action('onOKRDelete')}
          onCancel={action('onCancel')}
          onUserMakeAdmin={action('onUserMakeAdmin')}
        />
      </div>
    );
  })
