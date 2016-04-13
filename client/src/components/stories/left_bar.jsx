import React from 'react';
import LeftMenu from '../menu/left';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Left Menu', module)
  .add('manager mode', () => {
    var user = {
      username: 'christkv',
      name: 'Christian Kvalheim',
      title: 'Lead',
      roles: ['admin'],
      avatar: 'https://pbs.twimg.com/profile_images/668854490347388928/OV9501o7.jpg'
    };

    var manager = {
      username: 'paul',
      name: 'Paul Anderson',
      title: 'VP',
      roles: ['admin'],
      avatar: 'http://farm5.static.flickr.com/4050/4234711805_17e9b1ca47_m.jpg'
    };

    var reports = [{
      username: 'ryan',
      name: 'Ryan Paul',
      title: 'Developer',
      roles: ['admin'],
      avatar: 'http://2.bp.blogspot.com/_n7eQ5zqL7tM/SwUUR51_afI/AAAAAAAAAAw/n3UkLNoWCGY/s1600/ComputerSlave_2DtransGIF.gif'
    }, {
      username: 'cat',
      name: 'Fluffy',
      title: 'cat',
      roles: ['admin'],
      avatar: 'https://s-media-cache-ak0.pinimg.com/736x/29/a1/97/29a19723815892418543f8ff9b2e3539.jpg'
    }];

    return (
      <div className="objective1">
        <LeftMenu
          mode={'user'}
          user={user}
          manager={manager}
          reports={reports}
        />
      </div>
    );
  })
  .add('team mode', () => {
    var manager = {
      username: 'paul',
      name: 'Paul Anderson',
      title: 'VP',
      roles: ['admin'],
      avatar: 'http://farm5.static.flickr.com/4050/4234711805_17e9b1ca47_m.jpg'
    };

    var reports = [{
      username: 'ryan',
      name: 'Ryan Paul',
      title: 'Developer',
      roles: ['admin'],
      avatar: 'http://2.bp.blogspot.com/_n7eQ5zqL7tM/SwUUR51_afI/AAAAAAAAAAw/n3UkLNoWCGY/s1600/ComputerSlave_2DtransGIF.gif'
    }, {
      username: 'cat',
      name: 'Fluffy',
      title: 'cat',
      roles: ['admin'],
      avatar: 'https://s-media-cache-ak0.pinimg.com/736x/29/a1/97/29a19723815892418543f8ff9b2e3539.jpg'
    }];

    var team = {
      title: 'R Driver',
      avatar: 'http://marriottschool.net/teacher/govfinance/images/software/Rlogo.png'
    }

    return (
      <div className="objective1">
        <LeftMenu
          team={team}
          manager={manager}
          reports={reports}
        />
      </div>
    );
  })
