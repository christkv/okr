import React from 'react';
import Link from '../okr/link';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Link', module)
  .add('link objective', () => {
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

    var okr = {
      searchAll: function() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve([{
                id: 1,
                type: 'objective',
                owner_type: 'team',
                owner: 'Node.js team',
                title: 'some fancy objective',
              }, {
                id: 2,
                type: 'keyResult',
                owner_type: 'user',
                owner: 'Peter Peterson',
                title: 'fancy key result',
              }]);
          }, 200);
        });
      }
    }

    var store = {
      OKR: function() {
        return okr;
      }
    }

    return (
      <div className="objective1">
        <Link
          data={objective}
          store={store}
          isOpen={true}
          onLink={action('onLink')}
          onError={action('onError')}
          onCloseModal={action('onCloseModal')}
        />
      </div>
    );
  })
