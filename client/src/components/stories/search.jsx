import React from 'react';
import SearchBar from '../search';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('SearchBar', module)
  .add('simple basic search bar', () => {
    // var objective = {
    //   id: 1,
    //   objective: 'objective 1',
    //   tags: ['core'],
    //
    //   keyResults: [{
    //     id: 5,
    //     completeness: 45,
    //     keyResult: 'first key result',
    //     tags: ['mandatory']
    //   }, {
    //     id: 6,
    //     completeness: 15,
    //     keyResult: 'second key result'
    //   }]
    // };
    //
    return (
      <div className="objective1">
        <SearchBar />
      </div>
    );
  })
