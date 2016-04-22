"use strict"

import Store from './constants';
import co from 'co';

var fakeTagsState = {
  tags: [
    {id:1, text: 'mandatory'},
    {id:2, text: 'core'},
    {id:3, text: 'driver'}
  ]
}

export default class Tags {
  constructor(backend) {
    this.backend = backend;
  }

  load() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var tags = yield self.backend.loadTags();
        if(tags == null) return reject(new Error(`failed to locate tags`));
        // Resolve the user
        resolve(tags.map((t) => {
          return new Tag(t);
        }));
      }).catch(reject);
    });
  }
}

class Tag {
  constructor(state) {
    this.state = state;
  }

  get id() {
    return this.state.id;
  }

  get text() {
    return this.state.text;
  }
}
