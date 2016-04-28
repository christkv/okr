"use strict"

import co from 'co';

export default class Store {
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
