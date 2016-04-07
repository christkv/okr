import React from 'react';
import Objective from '../okr/objective';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Objective', module)
  .add('two key results', () => {
    var objective = {
      id: 1,
      objective: 'objective 1',
      tags: ['core'],

      keyResults: [{
        id: 5,
        completeness: 45,
        keyResult: 'first key result',
        tags: ['mandatory']
      }, {
        id: 6,
        completeness: 15,
        keyResult: 'second key result'
      }]
    };

    return (
      <div className="objective1">
        <Objective data={objective} onChange={action('onChange')}/>
      </div>
    );
  })
  .add('no key results', () => {
    var objective = {
      id: 1,
      objective: 'objective 1',
      tags: ['core'],
      keyResults: []
    };

    return (
      <div className="objective2">
        <Objective data={objective} onChange={action('onChange')}/>
      </div>
    );
  });
