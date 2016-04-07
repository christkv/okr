import React from 'react';
import KeyResult from '../okr/key_result';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Key Result', module)
  .add('simple key result', () => {
    var keyResult = {
      id: 5,
      completeness: 45,
      keyResult: 'first key result',
      tags: ['mandatory']
    };

    return (
      <div className="keyresult1">
        <table className="table table-striped">
          <tbody>
            <KeyResult data={keyResult} onChange={action('onChange')}/>
          </tbody>
        </table>
      </div>
    );
  })
  .add('simple key result editable', () => {
    var keyResult = {
      id: 5,
      completeness: 45,
      keyResult: 'first key result',
      tags: ['mandatory']
    };

    return (
      <div className="keyresult2">
        <table className="table table-striped">
          <tbody>
            <KeyResult data={keyResult} edit={true} onChange={action('onChange')}/>
          </tbody>
        </table>
      </div>
    );
  });
