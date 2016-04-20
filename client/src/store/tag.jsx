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
    this.state = {tags: []};
  }

  load() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        self.state = fakeTagsState;
        resolve(self);
      }).catch(reject);
    });
  }

  tags() {
    return this.state.tags;
  }
}
